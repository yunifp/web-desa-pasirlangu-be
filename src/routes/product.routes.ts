import { Router } from "express";
import { 
  createProduct, 
  getProducts, 
  getProductByIdOrSlug, 
  updateProduct, 
  deleteProduct, 
  uploadImage ,
  getMyProducts
} from "../controllers/product.controller";
// UBAH IMPORT DI SINI: gunakan verifyToken
import { verifyToken } from "../middlewares/auth.middleware"; 
import { uploadProductImage } from "../middlewares/upload.middleware";

const router = Router();

// Rute Publik (Bisa diakses tanpa login, cocok untuk katalog Frontend)
router.get("/", getProducts);
router.get("/manage/me", verifyToken, getMyProducts);
router.get("/:idOrSlug", getProductByIdOrSlug);

// Rute Private (Wajib login untuk CMS/Dashboard Admin UMKM)
// UBAH PEMANGGILAN MIDDLEWARE DI SINI:
router.use(verifyToken); 

router.post("/upload", verifyToken, uploadProductImage.array("images", 5), uploadImage);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;