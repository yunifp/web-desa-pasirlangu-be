import { Router } from "express";
import {
  getPublicMenus,
  createPublicMenu,
  updatePublicMenu,
  deletePublicMenu,
  reorderPublicMenus,
} from "../controllers/publicMenu.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.use(verifyToken);

router.get("/", getPublicMenus);
router.post("/", createPublicMenu);
router.put("/reorder", reorderPublicMenus); // Harus di atas /:id agar tidak bentrok
router.put("/:id", updatePublicMenu);
router.delete("/:id", deletePublicMenu);

export default router;