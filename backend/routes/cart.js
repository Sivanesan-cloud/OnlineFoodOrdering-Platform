import express from "express";
// Import protect from authController and the handlers from cartController
import { protect } from "../controllers/authController.js";
import { 
  addItemToCart, 
  updateCartItemQuantity, 
  deleteCartItem, 
  getCartItem 
} from "../controllers/cartController.js";

const router = express.Router();

// All cart routes require authentication
router.post("/add-to-cart", protect, addItemToCart);
router.post("/update-cart-item", protect, updateCartItemQuantity);
router.delete("/delete-cart-item", protect, deleteCartItem);
router.get("/get-cart", protect, getCartItem);

// Converted to ES Module default export
export default router;