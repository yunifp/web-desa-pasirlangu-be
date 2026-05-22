import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/auth.middleware";

const prisma = new PrismaClient();

// Ambil semua menu publik terurut berdasarkan kolom 'order'
export const getPublicMenus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const menus = await prisma.publicMenu.findMany({
            orderBy: { order: "asc" },
        });
        res.json({ success: true, data: menus });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Buat item menu baru
export const createPublicMenu = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { label, url } = req.body;
        if (!label || !url) {
            res.status(400).json({ success: false, message: "Label dan URL wajib diisi." });
            return;
        }

        // Cari nomor urut terakhir
        const lastMenu = await prisma.publicMenu.findFirst({
            orderBy: { order: "desc" },
        });
        const nextOrder = lastMenu ? lastMenu.order + 1 : 1;

        const newMenu = await prisma.publicMenu.create({
            data: {
                label,
                url,
                order: nextOrder,
            },
        });

        res.status(201).json({ success: true, message: "Menu navbar ditambahkan.", data: newMenu });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update label atau URL menu
export const updatePublicMenu = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { label, url } = req.body;

        const updated = await prisma.publicMenu.update({
            where: { id: String(id) },
            data: { label, url },
        });

        res.json({ success: true, message: "Menu navbar diperbarui.", data: updated });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Hapus menu
export const deletePublicMenu = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.publicMenu.delete({
            where: { id: String(id) },
        });
        res.json({ success: true, message: "Menu navbar dihapus." });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Simpan ulang urutan menu hasil drag & drop / klik naik-turun
export const reorderPublicMenus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { orderedIds } = req.body; // Array of IDs: ['id2', 'id1', 'id3']
        if (!Array.isArray(orderedIds)) {
            res.status(400).json({ success: false, message: "Format array urutan tidak valid." });
            return;
        }

        // Lakukan update massal dalam satu transaksi database
        await prisma.$transaction(
            orderedIds.map((id: string, index: number) =>
                prisma.publicMenu.update({
                    where: { id },
                    data: { order: index + 1 },
                })
            )
        );

        res.json({ success: true, message: "Urutan navbar berhasil disimpan." });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};