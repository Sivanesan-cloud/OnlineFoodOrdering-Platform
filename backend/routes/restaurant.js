import express from "express";
// Import controllers cleanly using named imports and explicit .js extensions
import {
  getAllRestaurants,
  createRestaurant,
  getRestaurant,
  deleteRestaurant,
} from "../controllers/restaurantController.js";

import { protect } from "../controllers/authController.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

// Nested/nested route file import needs the .js extension as well
import menuRoutes from "./menu.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllRestaurants)
  .post(protect, authorizeRoles("admin"), createRestaurant);

router
  .route("/:storeId")
  .get(getRestaurant)
  .delete(protect, authorizeRoles("admin"), deleteRestaurant);

router.use("/:storeId/menus", menuRoutes);

// Converted to ES Module default export
export default router;