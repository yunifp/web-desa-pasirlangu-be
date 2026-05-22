import { Router } from "express";
import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";
import roleRoutes from "./role.routes";
import permissionRoutes from "./permissions.routes";
import menuRoutes from "./menu.routes";
import templateRoutes from "./templates.routes";
import categoryRoutes from "./categories.routes";
import postRoutes from "./posts.routes";
import pageRoutes from "./pages.routes";
import publicRoutes from "./public.routes";
import publicMenuRoutes from "./publicMenu.routes";

// Impor rute admin pengaturan baru
import settingRoutes from "./setting.routes";
import mediaRoutes from "./media.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/roles", roleRoutes);
router.use("/permissions", permissionRoutes);
router.use("/menus", menuRoutes);
router.use("/templates", templateRoutes);
router.use("/categories", categoryRoutes);
router.use("/posts", postRoutes);
router.use("/pages", pageRoutes);
router.use("/public-menus", publicMenuRoutes);

// Daftarkan rute pengaturan web untuk admin
router.use("/settings", settingRoutes);

router.use("/public", publicRoutes);
router.use("/media", mediaRoutes);

export default router;