import express from "express";
// Import menu controllers with the mandatory .js extension
import {
  getAllMenus,
  createMenu,
  deleteMenu,
  addItemToMenu,
} from "../controllers/menuController.js";
import { protect } from "../controllers/authController.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllMenus)
  .post(protect, authorizeRoles("admin"), createMenu);

// add food item to a specific menu (more specific, must come before /:menuId)
router
  .route("/:menuId/addItem")
  .patch(protect, authorizeRoles("admin"), addItemToMenu);

router.route("/:menuId").delete(protect, authorizeRoles("admin"), deleteMenu);

// Converted to ES Module default export
export default router;