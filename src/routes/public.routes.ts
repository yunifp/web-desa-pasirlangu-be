import { Router } from "express";
import {
  getPublicPosts,
  getPublicPostBySlug,
  getPublicPageBySlug,
  getPublicCategories,
} from "../controllers/public.controller";
import { getPublicMenus } from "../controllers/publicMenu.controller";

// Impor pembaca pengaturan global dari controller baru
import { getSettings } from "../controllers/setting.controller";

const router = Router();

// --- ENDPOINT BARU: SEDOT PENGATURAN IDENTITAS WEB ---
router.get("/settings", getSettings);
router.get("/navbar", getPublicMenus);
router.get("/categories", getPublicCategories);
router.get("/posts", getPublicPosts);
router.get("/posts/:slug", getPublicPostBySlug);
router.get("/pages/:slug", getPublicPageBySlug);

export default router;