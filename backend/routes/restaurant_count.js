// routes/restaurants.js
import express from "express";
import Restaurant from "../models/restaurant.js"; // Explicit model path extension

const router = express.Router();

router.get("/count", async (req, res) => {
  try {
    const count = await Restaurant.countDocuments();
    res.json({ count });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to fetch the number of restaurants." });
  }
});

// Converted to ES Module default export
export default router;