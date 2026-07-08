import express from "express";
// Import controllers cleanly using named imports and explicit .js extensions
import {
  getFoodItem,
  createFoodItem,
  getAllFoodItems,
  deleteFoodItem,
  updateFoodItem,
} from "../controllers/foodItemController.js";
import { protect } from "../controllers/authController.js";

// Note: If you have an authorizeRoles middleware file, ensure it's imported correctly here
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = express.Router({ mergeParams: true });

router.route("/item").post(protect, authorizeRoles("admin"), createFoodItem);

router.route("/items/:storeId").get(getAllFoodItems);

router
  .route("/item/:foodId")
  .get(getFoodItem)
  .patch(protect, authorizeRoles("admin"), updateFoodItem)
  .delete(protect, authorizeRoles("admin"), deleteFoodItem);

// Converted to ES Module default export
export default router;