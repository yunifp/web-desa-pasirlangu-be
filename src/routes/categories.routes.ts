import { Router } from "express";
import {
  createCategory,
  getCategories,
  getAllCategoriesList,
  getCategoryByIdOrSlug,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";

const router = Router();

router.post("/", createCategory);
router.get("/", getCategories);
router.get("/all", getAllCategoriesList); // Endpoint khusus dropdown FE
router.get("/:idOrSlug", getCategoryByIdOrSlug);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;