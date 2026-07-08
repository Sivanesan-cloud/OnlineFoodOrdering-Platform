import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

import mongoose from "mongoose";
import foodItem from "../models/fooditems.js";

await mongoose.connect(process.env.DB_URI);
console.log("✅ Connected to MongoDB\n");

// Set stock=10 for any item that has no stock field or stock is 0
const r1 = await foodItem.updateMany(
  { stock: { $exists: false } },
  { $set: { stock: 10 } }
);
const r2 = await foodItem.updateMany(
  { stock: 0 },
  { $set: { stock: 10 } }
);

console.log(`Items updated (had no stock field): ${r1.modifiedCount}`);
console.log(`Items updated (stock was 0)       : ${r2.modifiedCount}`);

// Verify
const total = await foodItem.countDocuments();
const inStock = await foodItem.countDocuments({ stock: { $gt: 0 } });
console.log(`\nTotal food items : ${total}`);
console.log(`In stock now     : ${inStock} ✅`);

await mongoose.disconnect();
console.log("\n🎉 All items are now In Stock!");
process.exit(0);
