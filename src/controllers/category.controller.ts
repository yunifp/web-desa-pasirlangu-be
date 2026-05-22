import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

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
 * 1. CREATE CATEGORY
 */
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, templateId } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Nama kategori wajib diisi." });
    }

    const targetSlug = slug ? generateSlug(slug) : generateSlug(name);

    const existing = await prisma.category.findUnique({
      where: { slug: targetSlug },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slug kategori sudah digunakan. Silakan gunakan nama atau slug lain.",
      });
    }

    if (templateId) {
      const validTemplate = await prisma.template.findUnique({ where: { id: templateId } });
      if (!validTemplate) {
        return res.status(400).json({ success: false, message: "Template yang dipilih tidak valid/tidak ditemukan." });
      }
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug: targetSlug,
        description,
        templateId: templateId || null,
      },
      include: {
        template: true, 
      },
    });

    res.status(201).json({
      success: true,
      message: "Kategori berhasil dibuat.",
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Gagal membuat kategori.",
      error: error.message,
    });
  }
};

/**
 * 2. GET ALL CATEGORIES
 */
export const getCategories = async (req: Request, res: Response) => {
  try {
    const { skip, take, pageNumber, limitNumber } = getPagination(
      req.query.page as string,
      req.query.limit as string
    );

    const search = req.query.search as string;
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [data, totalItems] = await prisma.$transaction([
      prisma.category.findMany({
        where: whereClause,
        skip,
        take,
        include: {
          template: true, 
        },
        orderBy: { name: "asc" },
      }),
      prisma.category.count({ where: whereClause }),
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
 * 3. GET ALL CATEGORIES LIST
 */
export const getAllCategoriesList = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        template: true,
      },
      orderBy: { name: "asc" },
    });
    res.json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 4. GET CATEGORY BY ID ATAU SLUG
 */
export const getCategoryByIdOrSlug = async (req: Request, res: Response) => {
  try {
    // PENYESUAIAN: Penegasan tipe eksplisit ke string murni
    const idOrSlug = req.params.idOrSlug as string;

    const category = await prisma.category.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug },
        ],
      },
      include: {
        template: true,
      },
    });

    if (!category) {
      return res.status(404).json({ success: false, message: "Kategori tidak ditemukan." });
    }

    res.json({ success: true, data: category });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 5. UPDATE CATEGORY
 */
export const updateCategory = async (req: Request, res: Response) => {
  try {
    // PENYESUAIAN: Penegasan tipe eksplisit ke string murni
    const id = req.params.id as string;
    const { name, slug, description, templateId } = req.body;

    const target = await prisma.category.findUnique({ where: { id } });
    if (!target) {
      return res.status(404).json({ success: false, message: "Kategori tidak ditemukan." });
    }

    const dataToUpdate: any = { description };

    if (name) {
      dataToUpdate.name = name;
    }

    if (slug || name) {
      const targetSlug = slug ? generateSlug(slug) : generateSlug(name || target.name);

      if (targetSlug !== target.slug) {
        const existing = await prisma.category.findUnique({ where: { slug: targetSlug } });
        if (existing) {
          return res.status(400).json({
            success: false,
            message: "Slug sudah digunakan oleh kategori lain.",
          });
        }
      }
      dataToUpdate.slug = targetSlug;
    }

    if (templateId !== undefined) {
      if (templateId === null || templateId === "") {
        dataToUpdate.templateId = null;
      } else {
        const validTemplate = await prisma.template.findUnique({ where: { id: templateId } });
        if (!validTemplate) {
          return res.status(400).json({ success: false, message: "Template yang dipilih tidak valid." });
        }
        dataToUpdate.templateId = templateId;
      }
    }

    const updated = await prisma.category.update({
      where: { id },
      data: dataToUpdate,
      include: {
        template: true,
      },
    });

    res.json({
      success: true,
      message: "Kategori berhasil diperbarui.",
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Gagal memperbarui kategori.", error: error.message });
  }
};

/**
 * 6. DELETE CATEGORY
 */
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    // PENYESUAIAN: Penegasan tipe eksplisit ke string murni
    const id = req.params.id as string;

    const target = await prisma.category.findUnique({ where: { id } });
    if (!target) {
      return res.status(404).json({ success: false, message: "Kategori tidak ditemukan." });
    }

    await prisma.category.delete({ where: { id } });

    res.json({ success: true, message: "Kategori berhasil dihapus." });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Gagal menghapus kategori.", error: error.message });
  }
};