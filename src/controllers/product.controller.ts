import { Response } from "express";
import { PrismaClient, PostStatus } from "@prisma/client";
import { AuthRequest } from "../middlewares/auth.middleware";

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

// ==========================================
// UPLOAD MULTIPLE GAMBAR
// ==========================================
export const uploadImage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // req.files digunakan karena multer menggunakan .array()
        const files = req.files as Express.Multer.File[];
        
        if (!files || files.length === 0) {
            res.status(400).json({ success: false, message: "File gambar tidak ditemukan." });
            return;
        }

        // Petakan semua file menjadi array URL
        const imageUrls = files.map(file => `/uploads/products/${file.filename}`);

        res.status(200).json({
            success: true,
            message: "Gambar berhasil diunggah.",
            data: { urls: imageUrls } // Kembalikan array 'urls'
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Gagal mengunggah gambar.", error: error.message });
    }
};

// ==========================================
// CREATE PRODUK
// ==========================================
export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const authorId = req.user?.id;
        if (!authorId) {
            res.status(401).json({ success: false, message: "Sesi tidak valid." });
            return;
        }

        const {
            name, description, price, stock, 
            image, images, // Tambahkan 'images' untuk menangkap galeri
            button1Label, button1Url, button2Label, button2Url,
            status, categoryId
        } = req.body;

        if (!name || !description || price === undefined || stock === undefined) {
            res.status(400).json({ success: false, message: "Nama, deskripsi, harga, dan stok wajib diisi." });
            return;
        }

        let baseSlug = generateSlug(name);
        let targetSlug = baseSlug;
        let counter = 1;

        while (await prisma.product.findUnique({ where: { slug: targetSlug } })) {
            targetSlug = `${baseSlug}-${counter}`;
            counter++;
        }

        const product = await prisma.product.create({
            data: {
                name,
                slug: targetSlug,
                description,
                price: Number(price),
                stock: Number(stock),
                image: image || null,
                images: images || [], // Simpan array gambar tambahan ke database
                button1Label: button1Label || null,
                button1Url: button1Url || null,
                button2Label: button2Label || null,
                button2Url: button2Url || null,
                status: status || PostStatus.DRAFT,
                authorId,
                categoryId: categoryId ? String(categoryId) : null,
            },
        });

        res.status(201).json({ success: true, message: "Produk berhasil ditambahkan.", data: product });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Gagal membuat produk.", error: error.message });
    }
};

// ==========================================
// GET SEMUA PRODUK (PUBLIK)
// ==========================================
export const getProducts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { skip, take, pageNumber, limitNumber } = getPagination(req.query.page as string, req.query.limit as string);
        const search = req.query.search as string;
        const status = req.query.status as PostStatus;
        const categoryId = req.query.categoryId as string;

        const whereClause: any = {};

        if (search) {
            whereClause.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
            ];
        }

        if (status && Object.values(PostStatus).includes(status)) whereClause.status = status;
        if (categoryId) whereClause.categoryId = categoryId;

        const [data, totalItems] = await prisma.$transaction([
            prisma.product.findMany({
                where: whereClause,
                skip, take,
                include: {
                    category: { select: { id: true, name: true } },
                    author: { select: { id: true, name: true } },
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.product.count({ where: whereClause }),
        ]);

        res.json({
            success: true, data,
            meta: { totalItems, currentPage: pageNumber, itemsPerPage: limitNumber, totalPages: Math.ceil(totalItems / limitNumber) },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==========================================
// GET PRODUK MILIK USER LOGIN (PRIVATE)
// ==========================================
export const getMyProducts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const authorId = req.user?.id;
        if (!authorId) {
            res.status(401).json({ success: false, message: "Sesi tidak valid." });
            return;
        }

        const { skip, take, pageNumber, limitNumber } = getPagination(req.query.page as string, req.query.limit as string);
        const search = req.query.search as string;
        const status = req.query.status as PostStatus;
        const categoryId = req.query.categoryId as string;

        // FILTER: Hanya ambil data yang author-nya adalah user saat ini
        const whereClause: any = { authorId }; 

        if (search) {
            whereClause.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
            ];
        }

        if (status && Object.values(PostStatus).includes(status)) whereClause.status = status;
        if (categoryId) whereClause.categoryId = categoryId;

        const [data, totalItems] = await prisma.$transaction([
            prisma.product.findMany({
                where: whereClause,
                skip, take,
                include: {
                    category: { select: { id: true, name: true } },
                    author: { select: { id: true, name: true } },
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.product.count({ where: whereClause }),
        ]);

        res.json({
            success: true, data,
            meta: { totalItems, currentPage: pageNumber, itemsPerPage: limitNumber, totalPages: Math.ceil(totalItems / limitNumber) },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==========================================
// GET DETAIL PRODUK BY ID ATAU SLUG
// ==========================================
export const getProductByIdOrSlug = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const idOrSlug = req.params.idOrSlug as string;
        const product = await prisma.product.findFirst({
            where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
            include: {
                category: { select: { id: true, name: true } },
                author: { select: { id: true, name: true } }
            },
        });

        if (!product) {
            res.status(404).json({ success: false, message: "Produk tidak ditemukan." });
            return;
        }
        res.json({ success: true, data: product });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==========================================
// UPDATE PRODUK
// ==========================================
export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const {
            name, slug, description, price, stock, 
            image, images, // Tambahkan 'images' untuk update galeri
            button1Label, button1Url, button2Label, button2Url,
            status, categoryId
        } = req.body;

        const target = await prisma.product.findUnique({ where: { id } });
        if (!target) {
            res.status(404).json({ success: false, message: "Produk tidak ditemukan." });
            return;
        }

        const dataToUpdate: any = {};

        if (name) dataToUpdate.name = name;
        if (description) dataToUpdate.description = description;
        if (price !== undefined) dataToUpdate.price = Number(price);
        if (stock !== undefined) dataToUpdate.stock = Number(stock);
        if (image !== undefined) dataToUpdate.image = image || null;
        if (images !== undefined) dataToUpdate.images = images || []; // Update array galeri gambar

        if (button1Label !== undefined) dataToUpdate.button1Label = button1Label || null;
        if (button1Url !== undefined) dataToUpdate.button1Url = button1Url || null;
        if (button2Label !== undefined) dataToUpdate.button2Label = button2Label || null;
        if (button2Url !== undefined) dataToUpdate.button2Url = button2Url || null;

        if (categoryId !== undefined) dataToUpdate.categoryId = categoryId ? String(categoryId) : null;
        if (status && Object.values(PostStatus).includes(status)) dataToUpdate.status = status;

        if (slug || name) {
            const baseSlug = slug ? generateSlug(slug) : generateSlug(name || target.name);
            let targetSlug = baseSlug;
            let counter = 1;
            while (true) {
                const existing = await prisma.product.findUnique({ where: { slug: targetSlug } });
                if (!existing || existing.id === id) break;
                targetSlug = `${baseSlug}-${counter}`;
                counter++;
            }
            dataToUpdate.slug = targetSlug;
        }

        const updated = await prisma.product.update({ where: { id }, data: dataToUpdate });
        res.json({ success: true, message: "Produk diperbarui.", data: updated });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Gagal memperbarui produk.", error: error.message });
    }
};

// ==========================================
// DELETE PRODUK
// ==========================================
export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        await prisma.product.delete({ where: { id } });
        res.json({ success: true, message: "Produk berhasil dihapus." });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Gagal menghapus produk.", error: error.message });
    }
};