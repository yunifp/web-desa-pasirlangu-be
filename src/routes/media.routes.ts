import { Router } from "express";
import { getMediaLibrary, registerMediaRecord, deleteMediaItem } from "../controllers/media.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.use(verifyToken);
router.get("/", getMediaLibrary);
router.post("/register", registerMediaRecord);
router.delete("/:id", deleteMediaItem);

export default router;