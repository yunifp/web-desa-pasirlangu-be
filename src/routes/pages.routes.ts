import { Router } from "express";
import { createPage, getPages, getPageById, updatePage, deletePage } from "../controllers/page.controller";
import { verifyToken, requirePermission } from "../middlewares/auth.middleware";

const router = Router();
router.use(verifyToken);

router.post("/", requirePermission("/pages", "CREATE"), createPage);
router.get("/", requirePermission("/pages", "READ"), getPages);
router.get("/:id", requirePermission("/pages", "READ"), getPageById);
router.put("/:id", requirePermission("/pages", "UPDATE"), updatePage);
router.delete("/:id", requirePermission("/pages", "DELETE"), deletePage);


export default router;