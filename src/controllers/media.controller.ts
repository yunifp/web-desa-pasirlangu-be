import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/auth.middleware";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// 1. GET ALL MEDIA (Menampilkan aset di laci pustaka)
export const getMediaLibrary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const mediaFiles = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: mediaFiles });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. REGISTER MEDIA (Dipanggil otomatis oleh middleware upload lu setelah file tersimpan)
export const registerMediaRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fileName, fileUrl, mimeType, size } = req.body;
    if (!fileUrl) {
      res.status(400).json({ success: false, message: "Parameter URL file wajib disertakan." });
      return;
    }

    const existing = await prisma.media.findUnique({ where: { fileUrl } });
    if (existing) {
      res.json({ success: true, data: existing });
      return;
    }

    const newMedia = await prisma.media.create({
      data: {
        fileName: fileName || path.basename(fileUrl),
        fileUrl,
        mimeType: mimeType || "application/octet-stream",
        size: Number(size) || 0,
      },
    });

    res.status(201).json({ success: true, data: newMedia });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. DELETE MEDIA
export const deleteMediaItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const media = await prisma.media.findUnique({ where: { id: String(id) } });
    
    if (!media) {
      res.status(404).json({ success: false, message: "Aset media tidak ditemukan." });
      return;
    }

    // [PERBAIKAN] Mengarah ke root folder project (process.cwd()) 
    // karena fileUrl formatnya sudah "/uploads/posts/media-xxx.pdf"
    if (media.fileUrl.startsWith("/uploads")) {
      const filePath = path.join(process.cwd(), media.fileUrl);
      
      // Hapus fisik jika file benar-benar ada di server
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await prisma.media.delete({ where: { id: String(id) } });
    res.json({ success: true, message: "Aset media berhasil dihapus dari pustaka." });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};