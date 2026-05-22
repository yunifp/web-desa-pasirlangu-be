import { Router } from "express";
import {
  createPost, getPosts, getPostByIdOrSlug,
  updatePost, deletePost, uploadImage
} from "../controllers/post.controller";
import { verifyToken, requirePermission } from "../middlewares/auth.middleware"; // cite: uploaded:yunifp/cms-be/cms-be-471afa64cd5996597cc8a8aeb075bf9b1877a06b/src/middlewares/auth.middleware.ts
import { uploadPostImage } from "../middlewares/upload.middleware"; // cite: uploaded:yunifp/cms-be/cms-be-471afa64cd5996597cc8a8aeb075bf9b1877a06b/src/middlewares/upload.middleware.ts

const router = Router();

router.use(verifyToken); // cite: uploaded:yunifp/cms-be/cms-be-471afa64cd5996597cc8a8aeb075bf9b1877a06b/src/middlewares/auth.middleware.ts

// Endpoint khusus upload file gambar artikel
router.post("/upload-image", requirePermission("/posts", "CREATE"), uploadPostImage.single("image"), uploadImage); // cite: uploaded:yunifp/cms-be/cms-be-471afa64cd5996597cc8a8aeb075bf9b1877a06b/src/middlewares/auth.middleware.ts

router.post("/", requirePermission("/posts", "CREATE"), createPost); // cite: uploaded:yunifp/cms-be/cms-be-471afa64cd5996597cc8a8aeb075bf9b1877a06b/src/middlewares/auth.middleware.ts
router.get("/", requirePermission("/posts", "READ"), getPosts); // cite: uploaded:yunifp/cms-be/cms-be-471afa64cd5996597cc8a8aeb075bf9b1877a06b/src/middlewares/auth.middleware.ts
router.get("/:idOrSlug", requirePermission("/posts", "READ"), getPostByIdOrSlug); // cite: uploaded:yunifp/cms-be/cms-be-471afa64cd5996597cc8a8aeb075bf9b1877a06b/src/middlewares/auth.middleware.ts
router.put("/:id", requirePermission("/posts", "UPDATE"), updatePost); // cite: uploaded:yunifp/cms-be/cms-be-471afa64cd5996597cc8a8aeb075bf9b1877a06b/src/middlewares/auth.middleware.ts
router.delete("/:id", requirePermission("/posts", "DELETE"), deletePost); // cite: uploaded:yunifp/cms-be/cms-be-471afa64cd5996597cc8a8aeb075bf9b1877a06b/src/middlewares/auth.middleware.ts

export default router;