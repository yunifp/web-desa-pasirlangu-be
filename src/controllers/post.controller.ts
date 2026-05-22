import { Response } from "express";
import { PrismaClient, PostStatus } from "@prisma/client";
import { AuthRequest } from "../middlewares/auth.middleware"; // cite: uploaded:yunifp/cms-be/cms-be-471afa64cd5996597cc8a8aeb075bf9b1877a06b/src/middlewares/auth.middleware.ts

const prisma = new PrismaClient();

const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

const getPagination = (page?: string, limit?: string) => {
  const pageNumber = parseInt(page as string) || 1;
  const limitNumber = parseInt(limit as string) || 10;
  const skip = (pageNumber - 1) * limitNumber;
  return { skip, take: limitNumber, pageNumber, limitNumber };
};

/**
 * 0. UPLOAD GAMBAR POSTINGAN (ENDPOINT KHUSUS)
 */
export const uploadImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: "File gambar tidak ditemukan." });
      return;
    }

    // Mengembalikan URL/path file yang bisa diakses publik
    const imageUrl = `/uploads/posts/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      message: "Gambar berhasil diunggah.",
      data: { url: imageUrl }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Gagal mengunggah gambar.", error: error.message });
  }
};

/**
 * 1. CREATE POST
 */
export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const authorId = req.user?.id; 
    if (!authorId) {
      res.status(401).json({ success: false, message: "Sesi tidak valid." });
      return;
    }

    const { 
      title, titleEn, slug, content, contentEn, 
      image, imageCaption, status, categoryId 
    } = req.body;

    if (!title || !content || !categoryId) {
      res.status(400).json({ success: false, message: "Judul (ID), konten (ID), dan kategori wajib diisi." });
      return;
    }

    const categoryExists = await prisma.category.findUnique({ where: { id: String(categoryId) } });
    if (!categoryExists) {
      res.status(400).json({ success: false, message: "Kategori tidak valid." });
      return;
    }

    let baseSlug = slug ? generateSlug(slug) : generateSlug(title);
    let targetSlug = baseSlug;
    let counter = 1;

    while (await prisma.post.findUnique({ where: { slug: targetSlug } })) {
      targetSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const postStatus: PostStatus = status || PostStatus.DRAFT;
    const publishedAt = postStatus === PostStatus.PUBLISHED ? new Date() : null;

    const post = await prisma.post.create({
      data: {
        title,
        titleEn: titleEn || null,
        slug: targetSlug,
        content,
        contentEn: contentEn || null,
        image: image || null,
        imageCaption: imageCaption || null,
        status: postStatus,
        categoryId: String(categoryId),
        authorId,
        publishedAt,
      },
    });

    res.status(201).json({ success: true, message: "Postingan berhasil dibuat.", data: post });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Gagal membuat postingan.", error: error.message });
  }
};

/**
 * 2. GET ALL POSTS
 */
export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { skip, take, pageNumber, limitNumber } = getPagination(req.query.page as string, req.query.limit as string);
    const search = req.query.search as string;
    const status = req.query.status as PostStatus;
    const categoryId = req.query.categoryId as string;

    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { titleEn: { contains: search } },
        { content: { contains: search } },
        { contentEn: { contains: search } },
      ];
    }

    if (status && Object.values(PostStatus).includes(status)) whereClause.status = status;
    if (categoryId) whereClause.categoryId = categoryId;

    const [data, totalItems] = await prisma.$transaction([
      prisma.post.findMany({
        where: whereClause,
        skip, take,
        include: {
          category: { select: { id: true, name: true, template: true } },
          author: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.post.count({ where: whereClause }),
    ]);

    res.json({
      success: true, data,
      meta: { totalItems, currentPage: pageNumber, itemsPerPage: limitNumber, totalPages: Math.ceil(totalItems / limitNumber) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 3. GET POST BY ID ATAU SLUG
 */
export const getPostByIdOrSlug = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const idOrSlug = req.params.idOrSlug as string;
    const post = await prisma.post.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      include: { category: { include: { template: true } }, author: { select: { id: true, name: true } } },
    });

    if (!post) { res.status(404).json({ success: false, message: "Postingan tidak ditemukan." }); return; }
    res.json({ success: true, data: post });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 4. UPDATE POST
 */
export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { 
      title, titleEn, slug, content, contentEn, 
      image, imageCaption, status, categoryId 
    } = req.body;

    const target = await prisma.post.findUnique({ where: { id } });
    if (!target) { res.status(404).json({ success: false, message: "Postingan tidak ditemukan." }); return; }

    const dataToUpdate: any = {};

    if (title) dataToUpdate.title = title;
    if (titleEn !== undefined) dataToUpdate.titleEn = titleEn || null;
    if (content) dataToUpdate.content = content;
    if (contentEn !== undefined) dataToUpdate.contentEn = contentEn || null;
    if (imageCaption !== undefined) dataToUpdate.imageCaption = imageCaption || null;
    if (image !== undefined) dataToUpdate.image = image || null;

    if (categoryId) dataToUpdate.categoryId = String(categoryId);

    if (slug || title) {
      const baseSlug = slug ? generateSlug(slug) : generateSlug(title || target.title);
      let targetSlug = baseSlug;
      let counter = 1;
      while (true) {
        const existing = await prisma.post.findUnique({ where: { slug: targetSlug } });
        if (!existing || existing.id === id) break;
        targetSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      dataToUpdate.slug = targetSlug;
    }

    if (status && Object.values(PostStatus).includes(status)) {
      dataToUpdate.status = status;
      if (status === PostStatus.PUBLISHED && !target.publishedAt) dataToUpdate.publishedAt = new Date();
    }

    const updated = await prisma.post.update({ where: { id }, data: dataToUpdate });
    res.json({ success: true, message: "Postingan diperbarui.", data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Gagal memperbarui.", error: error.message });
  }
};

/**
 * 5. DELETE POST
 */
export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.post.delete({ where: { id } });
    res.json({ success: true, message: "Postingan dihapus." });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Gagal menghapus.", error: error.message });
  }
};