import express from "express";
// Import order controllers and protect middleware using clean ESM imports
import {
  newOrder,
  getSingleOrder,
  myOrders,
} from "../controllers/orderController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

router.route("/new").post(protect, newOrder);

router.route("/:id").get(protect, getSingleOrder);
router.route("/me/myOrders").get(protect, myOrders);

// Converted to ES Module default export
export default router;