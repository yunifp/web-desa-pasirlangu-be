import { Router } from "express";
import {
  createTemplate,
  getTemplates,
  getAllTemplatesList,
  getTemplateByIdOrSlug,
  updateTemplate,
  deleteTemplate,
} from "../controllers/template.controller";

const router = Router();

router.post("/", createTemplate);
router.get("/", getTemplates);
router.get("/all", getAllTemplatesList); // Endpoint khusus dropdown FE
router.get("/:idOrSlug", getTemplateByIdOrSlug);
router.put("/:id", updateTemplate);
router.delete("/:id", deleteTemplate);

export default router;