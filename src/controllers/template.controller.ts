import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper: Pembuat Slug Otomatis yang Bersih
const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")        // Ganti spasi dengan tanda strip (-)
    .replace(/[^\w\-]+/g, "")    // Hapus karakter non-alfanumerik
    .replace(/\-\-+/g, "-");     // Hindari tanda strip ganda
};

// Helper: Paginasi
const getPagination = (page?: string, limit?: string) => {
  const pageNumber = parseInt(page as string) || 1;
  const limitNumber = parseInt(limit as string) || 10;
  const skip = (pageNumber - 1) * limitNumber;
  return { skip, take: limitNumber, pageNumber, limitNumber };
};

/**
 * 1. CREATE TEMPLATE
 */
export const createTemplate = async (req: Request, res: Response) => {
  try {
    const { name, slug, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Nama template wajib diisi." });
    }

    const targetSlug = slug ? generateSlug(slug) : generateSlug(name);

    // Cek apakah slug sudah terpakai
    const existing = await prisma.template.findUnique({
      where: { slug: targetSlug },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slug template sudah digunakan. Silakan gunakan nama atau slug lain.",
      });
    }

    const template = await prisma.template.create({
      data: {
        name,
        slug: targetSlug,
        description,
      },
    });

    res.status(201).json({
      success: true,
      message: "Template berhasil dibuat.",
      data: template,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Gagal membuat template.",
      error: error.message,
    });
  }
};

/**
 * 2. GET ALL TEMPLATES (DENGAN PAGINATION & SEARCH)
 */
export const getTemplates = async (req: Request, res: Response) => {
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
      prisma.template.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { name: "asc" },
      }),
      prisma.template.count({ where: whereClause }),
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
 * 3. GET ALL TEMPLATES (TANPA PAGINATION UNTUK DROPDOWN FE)
 */
export const getAllTemplatesList = async (req: Request, res: Response) => {
  try {
    const templates = await prisma.template.findMany({
      orderBy: { name: "asc" },
    });
    res.json({ success: true, data: templates });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 4. GET TEMPLATE BY ID ATAU SLUG
 */
export const getTemplateByIdOrSlug = async (req: Request, res: Response) => {
  try {
    // PENYESUAIAN: Penegasan tipe eksplisit ke string murni
    const idOrSlug = req.params.idOrSlug as string;

    const template = await prisma.template.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug },
        ],
      },
      include: {
        categories: true, 
      },
    });

    if (!template) {
      return res.status(404).json({ success: false, message: "Template tidak ditemukan." });
    }

    res.json({ success: true, data: template });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 5. UPDATE TEMPLATE
 */
export const updateTemplate = async (req: Request, res: Response) => {
  try {
    // PENYESUAIAN: Penegasan tipe eksplisit ke string murni
    const id = req.params.id as string;
    const { name, slug, description } = req.body;

    const target = await prisma.template.findUnique({ where: { id } });
    if (!target) {
      return res.status(404).json({ success: false, message: "Template tidak ditemukan." });
    }

    const dataToUpdate: any = { description };

    if (name) {
      dataToUpdate.name = name;
    }

    if (slug || name) {
      const targetSlug = slug ? generateSlug(slug) : generateSlug(name || target.name);
      
      if (targetSlug !== target.slug) {
        const existing = await prisma.template.findUnique({ where: { slug: targetSlug } });
        if (existing) {
          return res.status(400).json({
            success: false,
            message: "Slug sudah digunakan oleh template lain.",
          });
        }
      }
      dataToUpdate.slug = targetSlug;
    }

    const updated = await prisma.template.update({
      where: { id },
      data: dataToUpdate,
    });

    res.json({
      success: true,
      message: "Template berhasil diperbarui.",
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Gagal memperbarui template.", error: error.message });
  }
};

/**
 * 6. DELETE TEMPLATE
 */
export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    // PENYESUAIAN: Penegasan tipe eksplisit ke string murni
    const id = req.params.id as string;

    const target = await prisma.template.findUnique({ where: { id } });
    if (!target) {
      return res.status(404).json({ success: false, message: "Template tidak ditemukan." });
    }

    await prisma.template.delete({ where: { id } });

    res.json({ success: true, message: "Template berhasil dihapus." });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Gagal menghapus template.", error: error.message });
  }
};