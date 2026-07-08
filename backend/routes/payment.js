import express from "express";
import { protect } from "../controllers/authController.js";
import {
  processPayment,
  sendStripeApiKey, // Synced name with your paymentController export
} from "../controllers/paymentController.js";

const router = express.Router();

router.route("/payment/process").post(protect, processPayment);
router.route("/stripeapi").get(protect, sendStripeApiKey);

// Converted to ES Module default export
export default router;