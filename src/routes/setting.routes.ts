import { Router } from "express";
import { getSettings, bulkUpdateSettings } from "../controllers/setting.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", verifyToken, getSettings); // Akses baca dasbor admin
router.put("/bulk", verifyToken, bulkUpdateSettings); // Akses simpan massal

export default router;