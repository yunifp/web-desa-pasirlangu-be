import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/auth.middleware";

const prisma = new PrismaClient();

// 1. GET ALL SETTINGS (Bisa diakses publik tanpa token untuk Header & Footer)
export const getSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const settingsArray = await prisma.setting.findMany();
    
    // Transform array [{key: 'a', value: 'b'}] menjadi object murni { a: 'b' } demi kemudahan konsumsi Frontend
    const settingsObj: Record<string, string> = {};
    settingsArray.forEach(item => {
      settingsObj[item.key] = item.value;
    });

    res.json({ success: true, data: settingsObj });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. BULK UPDATE SETTINGS (Khusus Admin terlindungi JWT)
export const bulkUpdateSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const settingsData: Record<string, string> = req.body;
    if (!settingsData || typeof settingsData !== "object") {
      res.status(400).json({ success: false, message: "Format payload pengaturan tidak valid." });
      return;
    }

    // Lakukan upsert (update jika ada, insert jika belum ada) secara massal dalam satu transaksi
    const upsertPromises = Object.entries(settingsData).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    });

    await prisma.$transaction(upsertPromises);

    res.json({ success: true, message: "Pengaturan global berhasil diperbarui." });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};