import { Response } from "express";
import { PrismaClient, PostStatus } from "@prisma/client";
import { AuthRequest } from "../middlewares/auth.middleware";

const prisma = new PrismaClient();

const generateSlug = (text: string) => {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");
};

export const createPage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const authorId = req.user?.id;
    if (!authorId) { 
      res.status(401).json({ success: false, message: "Sesi tidak valid." }); 
      return; 
    }

    const { 
      title, titleEn, slug, content, contentEn, 
      image, imageCaption, status, templateId,
      contentExtras 
    } = req.body;

    if (!title) {
      res.status(400).json({ success: false, message: "Judul halaman wajib diisi." });
      return;
    }

    let baseSlug = slug ? generateSlug(slug) : generateSlug(title);
    let targetSlug = baseSlug;
    let counter = 1;
    while (await prisma.page.findUnique({ where: { slug: targetSlug } })) {
      targetSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const pageStatus: PostStatus = status || PostStatus.DRAFT;
    const page = await prisma.page.create({
      data: {
        title, 
        titleEn: titleEn || null, 
        slug: targetSlug, 
        content: content || "", 
        contentEn: contentEn || null,
        contentExtras: contentExtras || null,
        image: image || null, 
        imageCaption: imageCaption || null, 
        status: pageStatus, 
        templateId: templateId || null, 
        authorId,
        publishedAt: pageStatus === PostStatus.PUBLISHED ? new Date() : null,
      },
    });

    res.status(201).json({ success: true, message: "Halaman berhasil dibuat.", data: page });
  } catch (error: any) { 
    res.status(500).json({ success: false, error: error.message }); 
  }
};

export const getPages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pages = await prisma.page.findMany({
      include: { template: true, author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: pages });
  } catch (error: any) { 
    res.status(500).json({ success: false, error: error.message }); 
  }
};

export const getPageById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const page = await prisma.page.findUnique({
      where: { id: String(id) },
      include: { template: true }
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

export const updatePage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { 
      title, titleEn, slug, content, contentEn, 
      image, imageCaption, status, templateId,
      contentExtras 
    } = req.body;

    const target = await prisma.page.findUnique({ where: { id: String(id) } });
    if (!target) {
      res.status(404).json({ success: false, message: "Halaman tidak ditemukan." });
      return;
    }

    const dataToUpdate: any = {};

    if (title) dataToUpdate.title = title;
    if (titleEn !== undefined) dataToUpdate.titleEn = titleEn || null;
    if (content !== undefined) dataToUpdate.content = content || "";
    if (contentEn !== undefined) dataToUpdate.contentEn = contentEn || null;
    if (contentExtras !== undefined) dataToUpdate.contentExtras = contentExtras || null;
    if (imageCaption !== undefined) dataToUpdate.imageCaption = imageCaption || null;
    if (image !== undefined) dataToUpdate.image = image || null;
    if (templateId !== undefined) dataToUpdate.templateId = templateId || null;

    if (slug || title) {
      const baseSlug = slug ? generateSlug(slug) : generateSlug(title || target.title);
      let targetSlug = baseSlug;
      let counter = 1;
      while (true) {
        const existing = await prisma.page.findUnique({ where: { slug: targetSlug } });
        if (!existing || existing.id === id) break;
        targetSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      dataToUpdate.slug = targetSlug;
    }

    if (status && Object.values(PostStatus).includes(status)) {
      dataToUpdate.status = status;
      if (status === PostStatus.PUBLISHED && !target.publishedAt) {
        dataToUpdate.publishedAt = new Date();
      }
    }

    const updated = await prisma.page.update({ 
      where: { id: String(id) }, 
      data: dataToUpdate 
    });

    res.json({ success: true, message: "Halaman diperbarui.", data: updated });
  } catch (error: any) { 
    res.status(500).json({ success: false, error: error.message }); 
  }
};

export const deletePage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.page.delete({ where: { id: String(req.params.id) } });
    res.json({ success: true, message: "Halaman dihapus." });
  } catch (error: any) { 
    res.status(500).json({ success: false, error: error.message }); 
  }
};