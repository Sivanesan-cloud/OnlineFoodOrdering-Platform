import express from "express";
// Import all named exports from your controller cleanly inside curly braces
import {
    signup,
    login,
    forgotPassword,
    resetPassword,
    logout,
    protect,
    getUserProfile,
    updatePassword,
    updateProfile
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// update:
router.post("/forgetPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.route("/logout").get(logout);

router.route("/me").get(protect, getUserProfile);

router
  .route("/password/update")
  .put(protect, updatePassword);

router
  .route("/me/update")
  .put(protect, updateProfile);

export default router;