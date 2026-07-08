/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║               FoodGenie — Menu Seed Script                  ║
 * ║                                                              ║
 * ║  Reads from:  config/config.env  (env var: DB_URI)          ║
 * ║  Models used: Restaurant, foodItem, Menu                     ║
 * ║                                                              ║
 * ║  Menu schema (from models/menu.js):                         ║
 * ║    restaurant : ObjectId → Restaurant                        ║
 * ║    menu       : [{ category: String,                         ║
 * ║                    items: [ObjectId → foodItem] }]           ║
 * ║                                                              ║
 * ║  Run: npm run seed:menu                                      ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

// ─── Env & DNS ────────────────────────────────────────────────────────────────
import dns from "dns";
dns.setDefaultResultOrder("ipv4first"); // required for Atlas on Windows

import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" }); // reads DB_URI, PORT, etc.

// ─── Mongoose & Models ────────────────────────────────────────────────────────
import mongoose from "mongoose";
import Restaurant from "../models/restaurant.js";
import foodItem   from "../models/fooditems.js"; // model name is "foodItem" (lowercase f)
import Menu       from "../models/menu.js";

// ─── Connect ──────────────────────────────────────────────────────────────────
console.log("\n🔌 Connecting to MongoDB Atlas...");
console.log(`   URI : ${process.env.DB_URI?.substring(0, 40)}...`);

await mongoose.connect(process.env.DB_URI);
console.log(`✅ Connected → host: ${mongoose.connection.host}\n`);

// ─── Step 1: Show existing restaurants so you can pick one ───────────────────
const existingRestaurants = await Restaurant.find({}, "_id name isVeg address").lean();

if (existingRestaurants.length === 0) {
  console.error("❌ No restaurants found in the database.");
  console.error("   Run the main seeder first:  node seeder.js");
  await mongoose.disconnect();
  process.exit(1);
}

console.log("━".repeat(60));
console.log("🏪 Restaurants found in DB:");
console.log("━".repeat(60));
existingRestaurants.forEach((r, i) => {
  const tag = r.isVeg ? "🌿 VEG" : "🍗 NON-VEG";
  console.log(`  [${i + 1}] ${r.name.padEnd(24)} ${tag}`);
  console.log(`       ID: ${r._id}`);
});
console.log("━".repeat(60));
console.log();

// ─── Step 2: Check for existing food items ────────────────────────────────────
const existingFoodItems = await foodItem.find({}, "_id name restaurant").lean();

if (existingFoodItems.length === 0) {
  console.error("❌ No food items found in the database.");
  console.error("   Run the main seeder first:  node seeder.js");
  await mongoose.disconnect();
  process.exit(1);
}

// ─── Step 3: Clear existing menus ────────────────────────────────────────────
const menuCount = await Menu.countDocuments();
if (menuCount > 0) {
  console.log(`🗑️  Clearing ${menuCount} existing menu document(s)...`);
  await Menu.deleteMany({});
  console.log("✅ Menus cleared.\n");
} else {
  console.log("📭 No existing menus to clear.\n");
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns all food items belonging to a given restaurant */
const itemsFor = (restaurantId) =>
  existingFoodItems.filter(
    (f) => f.restaurant?.toString() === restaurantId.toString()
  );

/** Finds an item by partial name match (case-insensitive) */
const findItem = (items, partialName) => {
  const found = items.find((i) =>
    i.name.toLowerCase().includes(partialName.toLowerCase())
  );
  if (!found) {
    console.warn(`  ⚠️  Could not find item matching "${partialName}" — skipping`);
  }
  return found;
};

// ─── Step 4: Build menus per restaurant ──────────────────────────────────────
console.log("📋 Building menus...\n");

const createdMenus = [];

for (const restaurant of existingRestaurants) {
  const items = itemsFor(restaurant._id);

  if (items.length === 0) {
    console.log(`  ⚠️  No food items for "${restaurant.name}" — skipping menu.`);
    continue;
  }

  // ── Classify items by name keywords into categories ───────────────────────
  const categories = [];

  // Starters / Snacks
  const starterKeywords  = ["tikka", "samosa", "soup", "vada pav", "bhel", "kebab", "starter", "snack"];
  const mainKeywords     = ["biryani", "butter chicken", "curry", "rogan", "dal", "paneer", "palak", "masala dosa", "pav bhaji", "frankie"];
  const breadKeywords    = ["naan", "roti", "paratha", "bread", "puri"];
  const beverageKeywords = ["lassi", "chai", "coffee", "soda", "juice", "drink", "tea", "water"];
  const dessertKeywords  = ["gulab", "kheer", "halwa", "ice cream", "dessert", "sweet", "jamun"];
  const streetKeywords   = ["pav", "bhel", "frankie", "roll", "vada"];

  const classify = (name, keywords) =>
    keywords.some((kw) => name.toLowerCase().includes(kw));

  const starters  = items.filter((i) => classify(i.name, starterKeywords) && !classify(i.name, mainKeywords));
  const mains     = items.filter((i) => classify(i.name, mainKeywords));
  const breads    = items.filter((i) => classify(i.name, breadKeywords));
  const beverages = items.filter((i) => classify(i.name, beverageKeywords));
  const desserts  = items.filter((i) => classify(i.name, dessertKeywords));
  const street    = items.filter((i) => classify(i.name, streetKeywords) && !classify(i.name, mainKeywords));

  // Uncategorised items go into "Chef's Specials"
  const categorised = new Set([
    ...starters, ...mains, ...breads, ...beverages, ...desserts, ...street
  ].map((i) => i._id.toString()));
  const specials = items.filter((i) => !categorised.has(i._id.toString()));

  const menuSections = [];

  if (starters.length)  menuSections.push({ category: "Starters",        items: starters.map((i) => i._id) });
  if (street.length)    menuSections.push({ category: "Street Food",      items: street.map((i) => i._id) });
  if (mains.length)     menuSections.push({ category: "Main Course",      items: mains.map((i) => i._id) });
  if (breads.length)    menuSections.push({ category: "Breads",           items: breads.map((i) => i._id) });
  if (beverages.length) menuSections.push({ category: "Beverages",        items: beverages.map((i) => i._id) });
  if (desserts.length)  menuSections.push({ category: "Desserts",         items: desserts.map((i) => i._id) });
  if (specials.length)  menuSections.push({ category: "Chef's Specials",  items: specials.map((i) => i._id) });

  if (menuSections.length === 0) {
    console.log(`  ⚠️  Could not classify any items for "${restaurant.name}" — skipping.`);
    continue;
  }

  const created = await Menu.create({
    restaurant: restaurant._id,
    menu: menuSections,
  });

  createdMenus.push({ restaurant: restaurant.name, menuId: created._id, sections: menuSections });

  console.log(`  ✅ Menu created for: ${restaurant.name}`);
  menuSections.forEach((s) =>
    console.log(`       • ${s.category.padEnd(18)} — ${s.items.length} item(s)`)
  );
  console.log();
}

// ─── Step 5: Final Summary ───────────────────────────────────────────────────
console.log("━".repeat(60));
console.log("🎉 MENU SEED COMPLETE!");
console.log("━".repeat(60));
console.log(`  Restaurants processed : ${existingRestaurants.length}`);
console.log(`  Menus inserted        : ${createdMenus.length}`);
console.log("━".repeat(60));

console.log("\n Menu IDs created:");
createdMenus.forEach((m) =>
  console.log(`  ${m.restaurant.padEnd(24)} → ${m.menuId}`)
);

console.log("\n To verify in MongoDB Atlas:");
console.log("  1. Go to https://cloud.mongodb.com");
console.log("  2. Open your cluster → Collections → 'menus' collection");
console.log("  3. You should see documents with 'restaurant' and 'menu[]' fields");
console.log("  4. Each menu[] entry has { category, items: [ObjectId...] }");

console.log("\n To test in your browser:");
createdMenus.forEach((m) => {
  const rest = existingRestaurants.find(r => r.name === m.restaurant);
  if (rest) {
    console.log(`  http://localhost:5173/restaurant/${rest._id}`);
  }
});

await mongoose.disconnect();
console.log("\n🔌 Disconnected from MongoDB. Done!\n");
process.exit(0);
