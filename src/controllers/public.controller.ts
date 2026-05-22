import { Request, Response } from "express";
import { PrismaClient, PostStatus } from "@prisma/client";

const prisma = new PrismaClient();

// Helper untuk Paginasi yang aman
const getPagination = (page?: string, limit?: string) => {
  const pageNumber = parseInt(page as string) || 1;
  const limitNumber = parseInt(limit as string) || 10;
  const skip = (pageNumber - 1) * limitNumber;
  return { skip, take: limitNumber, pageNumber, limitNumber };
};

/**
 * 1. GET ALL PUBLISHED POSTS (Daftar Artikel Blog Publik)
 * Mendukung pencarian, filter kategori, dan paginasi
 */
export const getPublicPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { skip, take, pageNumber, limitNumber } = getPagination(
      req.query.page as string,
      req.query.limit as string
    );

    const search = req.query.search as string;
    const categorySlug = req.query.category as string;

    // Filter Wajib: Hanya ambil yang PUBLISHED
    const whereClause: any = {
      status: PostStatus.PUBLISHED,
    };

    // Filter Pencarian (Bilingual)
    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { titleEn: { contains: search } },
        { content: { contains: search } },
        { contentEn: { contains: search } },
      ];
    }

    // Filter berdasarkan Slug Kategori
    if (categorySlug) {
      whereClause.category = {
        slug: categorySlug,
      };
    }

    const [data, totalItems] = await prisma.$transaction([
      prisma.post.findMany({
        where: whereClause,
        skip,
        take,
        select: {
          id: true,
          title: true,
          titleEn: true,
          slug: true,
          image: true,
          imageCaption: true,
          publishedAt: true,
          createdAt: true,
          // Sertakan informasi kategori dan pemetaan template-nya
          category: {
            select: {
              name: true,
              slug: true,
              template: {
                select: { slug: true }
              }
            }
          },
          // Sertakan nama penulis saja demi privasi
          author: { select: { name: true } },
        },
        orderBy: { publishedAt: "desc" }, // Urutkan dari tanggal terbit terbaru
      }),
      prisma.post.count({ where: whereClause }),
    ]);

    res.json({
      success: true,
      data,
      meta: {
        totalItems,
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
        totalPages: Math.ceil(totalItems / limitNumber),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 2. GET SINGLE POST DETAIL (Berdasarkan Slug)
 * Menyediakan seluruh isi konten beserta *Template Slug* untuk instruksi *Dynamic Rendering*
 */
export const getPublicPostBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;

    const post = await prisma.post.findFirst({
      where: {
        slug,
        status: PostStatus.PUBLISHED, // Wajib proteksi status
      },
      include: {
        category: {
          include: {
            template: {
              select: { slug: true } // Kunci utama untuk pengenal tata letak di Frontend Publik
            }
          }
        },
        author: { select: { name: true } },
      },
    });

    if (!post) {
      res.status(404).json({ success: false, message: "Artikel tidak ditemukan atau belum diterbitkan." });
      return;
    }

    res.json({ success: true, data: post });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 3. GET SINGLE PAGE DETAIL (Halaman Statis Publik Berdasarkan Slug)
 * Contoh: /api/public/pages/tentang-kami
 */
export const getPublicPageBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;

    const page = await prisma.page.findFirst({
      where: {
        slug,
        status: PostStatus.PUBLISHED,
      },
      include: {
        template: {
          select: { slug: true } // Pengikat tata letak mandiri halaman statis
        },
        author: { select: { name: true } },
      },
    });

    if (!page) {
      res.status(404).json({ success: false, message: "Halaman tidak ditemukan." });
      return;
    }

    res.json({ success: true, data: page });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 4. GET ACTIVE CATEGORIES
 * Mengambil daftar kategori yang memiliki minimal 1 artikel terbit untuk menu navigasi Header
 */
export const getPublicCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        posts: {
          some: {
            status: PostStatus.PUBLISHED,
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        template: {
          select: { slug: true }
        }
      },
      orderBy: { name: "asc" },
    });

    res.json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};