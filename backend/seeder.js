import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

import mongoose from "mongoose";
import connectDatabase from "./config/database.js";
import Restaurant from "./models/restaurant.js";
import foodItem from "./models/fooditems.js";
import Menu from "./models/menu.js";

// ─── Connect ──────────────────────────────────────────────────────────────────
await connectDatabase();
await new Promise((res) => setTimeout(res, 2000));

// ─── Wipe existing data ───────────────────────────────────────────────────────
console.log("🗑️  Clearing old data...");
await Menu.deleteMany({});
await foodItem.deleteMany({});
await Restaurant.deleteMany({});
console.log("✅ Old data cleared.\n");

// ─── 1. RESTAURANTS ───────────────────────────────────────────────────────────
console.log("🏪 Seeding restaurants...");

const restaurants = await Restaurant.insertMany([
  // ── 1. Spice Garden ──────────────────────────────────────────────────────
  {
    name: "Spice Garden",
    isVeg: false,
    address: "12, MG Road, Bangalore",
    ratings: 4.5,
    numOfReviews: 120,
    location: { type: "Point", coordinates: [77.5946, 12.9716] },
    images: [{
      public_id: "spice_garden_1",
      url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
    }],
    reviews: [
      { name: "Ravi", rating: 5, Comment: "Best biryani in Bangalore!" },
      { name: "Priya", rating: 4, Comment: "Great food, slightly long wait." },
    ],
  },

  // ── 2. The Veg Paradise ───────────────────────────────────────────────────
  {
    name: "The Veg Paradise",
    isVeg: true,
    address: "45, Anna Nagar, Chennai",
    ratings: 4.2,
    numOfReviews: 85,
    location: { type: "Point", coordinates: [80.2707, 13.0827] },
    images: [{
      public_id: "veg_paradise_1",
      url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
    }],
    reviews: [
      { name: "Anita", rating: 5, Comment: "Pure veg heaven! Loved the dosa." },
      { name: "Kumar", rating: 4, Comment: "Very clean and tasty." },
    ],
  },

  // ── 3. Mumbai Bites ───────────────────────────────────────────────────────
  {
    name: "Mumbai Bites",
    isVeg: false,
    address: "7, Linking Road, Mumbai",
    ratings: 4.7,
    numOfReviews: 200,
    location: { type: "Point", coordinates: [72.8777, 19.076] },
    images: [{
      public_id: "mumbai_bites_1",
      url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
    }],
    reviews: [
      { name: "Rahul", rating: 5, Comment: "Vada Pav is legendary here!" },
      { name: "Sneha", rating: 4, Comment: "Feels like real Mumbai street food." },
    ],
  },

  // ── 4. Royal Tandoor ─────────────────────────────────────────────────────
  {
    name: "Royal Tandoor",
    isVeg: false,
    address: "33, Connaught Place, New Delhi",
    ratings: 4.6,
    numOfReviews: 175,
    location: { type: "Point", coordinates: [77.2167, 28.6139] },
    images: [{
      public_id: "royal_tandoor_1",
      url: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600",
    }],
    reviews: [
      { name: "Arjun", rating: 5, Comment: "The kebabs melted in my mouth!" },
      { name: "Meera", rating: 4, Comment: "Excellent ambience and food." },
    ],
  },

  // ── 5. Green Leaf Cafe ────────────────────────────────────────────────────
  {
    name: "Green Leaf Cafe",
    isVeg: true,
    address: "88, Koregaon Park, Pune",
    ratings: 4.3,
    numOfReviews: 95,
    location: { type: "Point", coordinates: [73.8946, 18.5362] },
    images: [{
      public_id: "green_leaf_1",
      url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600",
    }],
    reviews: [
      { name: "Pooja", rating: 5, Comment: "Healthy, fresh and so delicious!" },
      { name: "Vikram", rating: 4, Comment: "Love the salads and smoothies." },
    ],
  },

  // ── 6. Coastal Kitchen ────────────────────────────────────────────────────
  {
    name: "Coastal Kitchen",
    isVeg: false,
    address: "21, MG Road, Kochi",
    ratings: 4.8,
    numOfReviews: 230,
    location: { type: "Point", coordinates: [76.2673, 9.9312] },
    images: [{
      public_id: "coastal_kitchen_1",
      url: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600",
    }],
    reviews: [
      { name: "Thomas", rating: 5, Comment: "Best fish curry I've ever had!" },
      { name: "Anu", rating: 5, Comment: "Authentic Kerala flavours. A must visit!" },
    ],
  },
]);

console.log(`✅ ${restaurants.length} restaurants created.\n`);

const [spiceGarden, vegParadise, mumbaiBites, royalTandoor, greenLeaf, coastalKitchen] = restaurants;

// ─── 2. FOOD ITEMS ────────────────────────────────────────────────────────────
console.log("🍽️  Seeding food items...");

const foodItems = await foodItem.insertMany([

  // ══════════════════════════════════════════════════════════════════════════
  // 🌶️  SPICE GARDEN — Multi-cuisine Indian
  // ══════════════════════════════════════════════════════════════════════════
  {
    name: "Chicken Biryani",
    price: 250, stock: 15,
    description: "Fragrant basmati rice slow-cooked with tender chicken, saffron and whole spices.",
    ratings: 4.8, numOfReviews: 80,
    images: [{ public_id: "chicken_biryani", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400" }],
    restaurant: spiceGarden._id,
    reviews: [{ name: "Ravi", rating: 5, Comment: "Absolutely amazing!" }],
  },
  {
    name: "Butter Chicken",
    price: 280, stock: 15,
    description: "Creamy tomato-cashew curry with succulent chicken pieces, finished with cream.",
    ratings: 4.7, numOfReviews: 65,
    images: [{ public_id: "butter_chicken", url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400" }],
    restaurant: spiceGarden._id,
    reviews: [{ name: "Priya", rating: 5, Comment: "Restaurant quality at home!" }],
  },
  {
    name: "Mutton Rogan Josh",
    price: 320, stock: 10,
    description: "Slow-braised Kashmiri mutton in vibrant red gravy with whole spices.",
    ratings: 4.6, numOfReviews: 50,
    images: [{ public_id: "rogan_josh", url: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400" }],
    restaurant: spiceGarden._id,
    reviews: [{ name: "Arjun", rating: 5, Comment: "Just like my grandmother's!" }],
  },
  {
    name: "Chicken 65",
    price: 200, stock: 15,
    description: "Deep-fried spicy chicken bites marinated in ginger, garlic and fiery red chillies.",
    ratings: 4.7, numOfReviews: 90,
    images: [{ public_id: "chicken_65", url: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400" }],
    restaurant: spiceGarden._id,
    reviews: [{ name: "Rahul", rating: 5, Comment: "Perfectly crispy and spicy!" }],
  },
  {
    name: "Garlic Naan",
    price: 50, stock: 20,
    description: "Soft leavened bread topped with roasted garlic and fresh butter, baked in tandoor.",
    ratings: 4.5, numOfReviews: 110,
    images: [{ public_id: "garlic_naan", url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400" }],
    restaurant: spiceGarden._id,
    reviews: [{ name: "Sneha", rating: 5, Comment: "So soft and fluffy!" }],
  },
  {
    name: "Laccha Paratha",
    price: 40, stock: 20,
    description: "Flaky whole-wheat layered flatbread cooked on a griddle with pure ghee.",
    ratings: 4.4, numOfReviews: 60,
    images: [{ public_id: "laccha_paratha", url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400" }],
    restaurant: spiceGarden._id,
    reviews: [{ name: "Meera", rating: 4, Comment: "Crispy layers, loved it." }],
  },
  {
    name: "Mango Lassi",
    price: 80, stock: 20,
    description: "Refreshing chilled drink blended with yogurt and ripe Alphonso mangoes.",
    ratings: 4.9, numOfReviews: 130,
    images: [{ public_id: "mango_lassi", url: "https://images.unsplash.com/photo-1527515637462-cff94ebb96e4?w=400" }],
    restaurant: spiceGarden._id,
    reviews: [{ name: "Pooja", rating: 5, Comment: "Thick, sweet and perfect!" }],
  },
  {
    name: "Gulab Jamun",
    price: 70, stock: 20,
    description: "Soft milk-solid dumplings soaked in rose-cardamom sugar syrup, served warm.",
    ratings: 4.8, numOfReviews: 100,
    images: [{ public_id: "gulab_jamun", url: "https://images.unsplash.com/photo-1666218943208-34b56c82e32c?w=400" }],
    restaurant: spiceGarden._id,
    reviews: [{ name: "Kumar", rating: 5, Comment: "Melt-in-mouth perfection!" }],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 🥗  THE VEG PARADISE — Pure Vegetarian
  // ══════════════════════════════════════════════════════════════════════════
  {
    name: "Paneer Tikka",
    price: 220, stock: 15,
    description: "Marinated cottage cheese cubes grilled in tandoor with bell peppers and onions.",
    ratings: 4.6, numOfReviews: 75,
    images: [{ public_id: "paneer_tikka", url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400" }],
    restaurant: vegParadise._id,
    reviews: [{ name: "Anita", rating: 5, Comment: "Smoky and delicious!" }],
  },
  {
    name: "Veg Spring Rolls",
    price: 140, stock: 15,
    description: "Crispy golden rolls stuffed with stir-fried vegetables and glass noodles.",
    ratings: 4.4, numOfReviews: 55,
    images: [{ public_id: "spring_rolls", url: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400" }],
    restaurant: vegParadise._id,
    reviews: [{ name: "Vikram", rating: 4, Comment: "Light and crunchy!" }],
  },
  {
    name: "Dal Makhani",
    price: 180, stock: 15,
    description: "Slow-cooked black lentils simmered overnight in a rich buttery tomato gravy.",
    ratings: 4.7, numOfReviews: 90,
    images: [{ public_id: "dal_makhani", url: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400" }],
    restaurant: vegParadise._id,
    reviews: [{ name: "Ravi", rating: 5, Comment: "Restaurant quality dal!" }],
  },
  {
    name: "Palak Paneer",
    price: 190, stock: 15,
    description: "Cottage cheese cubes in a vibrant, spiced spinach-cream gravy.",
    ratings: 4.5, numOfReviews: 70,
    images: [{ public_id: "palak_paneer", url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400" }],
    restaurant: vegParadise._id,
    reviews: [{ name: "Priya", rating: 4, Comment: "Creamy and nutritious." }],
  },
  {
    name: "Masala Dosa",
    price: 120, stock: 20,
    description: "Giant crispy rice crepe filled with spiced mashed potatoes, served with coconut chutney and sambar.",
    ratings: 4.8, numOfReviews: 140,
    images: [{ public_id: "masala_dosa", url: "https://images.unsplash.com/photo-1630409351241-e90e7c7e9af0?w=400" }],
    restaurant: vegParadise._id,
    reviews: [{ name: "Kumar", rating: 5, Comment: "The crispiest dosa ever!" }],
  },
  {
    name: "Idli Sambar",
    price: 80, stock: 20,
    description: "Fluffy steamed rice cakes served with tangy lentil sambar and coconut chutney.",
    ratings: 4.6, numOfReviews: 100,
    images: [{ public_id: "idli_sambar", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400" }],
    restaurant: vegParadise._id,
    reviews: [{ name: "Anita", rating: 5, Comment: "Perfect South Indian breakfast!" }],
  },
  {
    name: "Fresh Lime Soda",
    price: 60, stock: 25,
    description: "Chilled sparkling water with freshly squeezed lime, a pinch of salt and sugar.",
    ratings: 4.4, numOfReviews: 80,
    images: [{ public_id: "lime_soda", url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400" }],
    restaurant: vegParadise._id,
    reviews: [{ name: "Pooja", rating: 4, Comment: "Very refreshing!" }],
  },
  {
    name: "Kheer",
    price: 90, stock: 20,
    description: "Traditional rice pudding slow-cooked in full-cream milk with cardamom, saffron and pistachios.",
    ratings: 4.6, numOfReviews: 60,
    images: [{ public_id: "kheer", url: "https://images.unsplash.com/photo-1571197119738-dcc8b27a3c83?w=400" }],
    restaurant: vegParadise._id,
    reviews: [{ name: "Meera", rating: 5, Comment: "Tastes like home!" }],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 🏙️  MUMBAI BITES — Street Food
  // ══════════════════════════════════════════════════════════════════════════
  {
    name: "Vada Pav",
    price: 40, stock: 30,
    description: "Mumbai's iconic street burger — spiced potato fritter inside a soft bun with dry garlic chutney.",
    ratings: 4.9, numOfReviews: 200,
    images: [{ public_id: "vada_pav", url: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400" }],
    restaurant: mumbaiBites._id,
    reviews: [{ name: "Rahul", rating: 5, Comment: "Legendary! Nothing beats this." }],
  },
  {
    name: "Pav Bhaji",
    price: 120, stock: 20,
    description: "Spicy mashed mixed vegetable curry served with buttered toasted pav rolls.",
    ratings: 4.8, numOfReviews: 160,
    images: [{ public_id: "pav_bhaji", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400" }],
    restaurant: mumbaiBites._id,
    reviews: [{ name: "Sneha", rating: 5, Comment: "Feels like Marine Drive!" }],
  },
  {
    name: "Bhel Puri",
    price: 60, stock: 25,
    description: "Crispy puffed rice tossed with onions, tomatoes, sev and tangy tamarind chutney.",
    ratings: 4.5, numOfReviews: 110,
    images: [{ public_id: "bhel_puri", url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400" }],
    restaurant: mumbaiBites._id,
    reviews: [{ name: "Arjun", rating: 5, Comment: "Takes me straight to Juhu beach!" }],
  },
  {
    name: "Sev Puri",
    price: 50, stock: 25,
    description: "Crispy puri topped with boiled potato, chutneys and an avalanche of thin sev.",
    ratings: 4.6, numOfReviews: 95,
    images: [{ public_id: "sev_puri", url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400" }],
    restaurant: mumbaiBites._id,
    reviews: [{ name: "Priya", rating: 5, Comment: "Crunchy burst of flavour!" }],
  },
  {
    name: "Chicken Frankie",
    price: 150, stock: 15,
    description: "Mumbai-style chicken roll wrapped in a flaky paratha with egg, onions and green chutney.",
    ratings: 4.7, numOfReviews: 120,
    images: [{ public_id: "chicken_frankie", url: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400" }],
    restaurant: mumbaiBites._id,
    reviews: [{ name: "Kumar", rating: 5, Comment: "Best frankie in the city!" }],
  },
  {
    name: "Cold Coffee",
    price: 90, stock: 20,
    description: "Chilled blended coffee with cold milk and a scoop of vanilla ice cream.",
    ratings: 4.6, numOfReviews: 85,
    images: [{ public_id: "cold_coffee", url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400" }],
    restaurant: mumbaiBites._id,
    reviews: [{ name: "Vikram", rating: 4, Comment: "Thick and perfectly sweet!" }],
  },
  {
    name: "Cutting Chai",
    price: 20, stock: 50,
    description: "Half-cup strong spiced tea brewed with ginger and cardamom — the original Mumbai energy shot.",
    ratings: 4.9, numOfReviews: 250,
    images: [{ public_id: "cutting_chai", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" }],
    restaurant: mumbaiBites._id,
    reviews: [{ name: "Rahul", rating: 5, Comment: "Absolutely essential!" }],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 👑  ROYAL TANDOOR — North Indian Grill
  // ══════════════════════════════════════════════════════════════════════════
  {
    name: "Seekh Kebab",
    price: 260, stock: 15,
    description: "Minced lamb and beef skewers seasoned with onion, coriander and chaat masala, char-grilled.",
    ratings: 4.8, numOfReviews: 105,
    images: [{ public_id: "seekh_kebab", url: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400" }],
    restaurant: royalTandoor._id,
    reviews: [{ name: "Arjun", rating: 5, Comment: "Juicy and packed with flavour!" }],
  },
  {
    name: "Tandoori Chicken",
    price: 300, stock: 12,
    description: "Whole chicken marinated overnight in yogurt and spices, roasted in a clay oven.",
    ratings: 4.9, numOfReviews: 140,
    images: [{ public_id: "tandoori_chicken", url: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=400" }],
    restaurant: royalTandoor._id,
    reviews: [{ name: "Meera", rating: 5, Comment: "Perfectly charred outside, juicy inside!" }],
  },
  {
    name: "Paneer Tikka",
    price: 230, stock: 15,
    description: "Cubes of cottage cheese marinated in spiced yogurt and grilled in the tandoor.",
    ratings: 4.6, numOfReviews: 70,
    images: [{ public_id: "rt_paneer_tikka", url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400" }],
    restaurant: royalTandoor._id,
    reviews: [{ name: "Priya", rating: 4, Comment: "Good vegetarian option." }],
  },
  {
    name: "Dal Bukhara",
    price: 200, stock: 15,
    description: "Iconic black lentil dal simmered for 18 hours with tomatoes, cream and spices.",
    ratings: 4.7, numOfReviews: 90,
    images: [{ public_id: "dal_bukhara", url: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400" }],
    restaurant: royalTandoor._id,
    reviews: [{ name: "Ravi", rating: 5, Comment: "Rich, velvety and extraordinary!" }],
  },
  {
    name: "Butter Naan",
    price: 60, stock: 30,
    description: "Pillowy soft tandoor-baked flatbread generously brushed with salted butter.",
    ratings: 4.5, numOfReviews: 120,
    images: [{ public_id: "butter_naan", url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400" }],
    restaurant: royalTandoor._id,
    reviews: [{ name: "Sneha", rating: 5, Comment: "Perfect for mopping up dal!" }],
  },
  {
    name: "Lamb Biryani",
    price: 350, stock: 10,
    description: "Aromatic long-grain rice dum-cooked with slow-braised lamb and caramelised onions.",
    ratings: 4.8, numOfReviews: 115,
    images: [{ public_id: "lamb_biryani", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400" }],
    restaurant: royalTandoor._id,
    reviews: [{ name: "Kumar", rating: 5, Comment: "Best biryani in Delhi!" }],
  },
  {
    name: "Rose Sharbat",
    price: 70, stock: 25,
    description: "Chilled rose-flavoured sugar syrup topped with cold milk and basil seeds.",
    ratings: 4.3, numOfReviews: 45,
    images: [{ public_id: "rose_sharbat", url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400" }],
    restaurant: royalTandoor._id,
    reviews: [{ name: "Anita", rating: 4, Comment: "Refreshing and fragrant!" }],
  },
  {
    name: "Phirni",
    price: 100, stock: 20,
    description: "Ground rice pudding set in earthen pots with saffron, cardamom and rose water.",
    ratings: 4.5, numOfReviews: 55,
    images: [{ public_id: "phirni", url: "https://images.unsplash.com/photo-1571197119738-dcc8b27a3c83?w=400" }],
    restaurant: royalTandoor._id,
    reviews: [{ name: "Pooja", rating: 5, Comment: "Creamy, aromatic classic!" }],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 🥬  GREEN LEAF CAFE — Healthy Veg
  // ══════════════════════════════════════════════════════════════════════════
  {
    name: "Avocado Toast",
    price: 180, stock: 15,
    description: "Multigrain sourdough topped with smashed avocado, cherry tomatoes, hemp seeds and lemon zest.",
    ratings: 4.6, numOfReviews: 60,
    images: [{ public_id: "avocado_toast", url: "https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=400" }],
    restaurant: greenLeaf._id,
    reviews: [{ name: "Pooja", rating: 5, Comment: "So fresh and light!" }],
  },
  {
    name: "Hummus Platter",
    price: 200, stock: 12,
    description: "Creamy Lebanese chickpea hummus with olive oil, paprika and warm pita triangles.",
    ratings: 4.5, numOfReviews: 45,
    images: [{ public_id: "hummus_platter", url: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400" }],
    restaurant: greenLeaf._id,
    reviews: [{ name: "Vikram", rating: 4, Comment: "Very authentic hummus!" }],
  },
  {
    name: "Buddha Bowl",
    price: 250, stock: 10,
    description: "Nourishing bowl with quinoa, roasted sweet potato, chickpeas, greens and tahini dressing.",
    ratings: 4.7, numOfReviews: 80,
    images: [{ public_id: "buddha_bowl", url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400" }],
    restaurant: greenLeaf._id,
    reviews: [{ name: "Anita", rating: 5, Comment: "Nutritious and genuinely tasty!" }],
  },
  {
    name: "Greek Salad",
    price: 190, stock: 15,
    description: "Crisp cucumber, tomato, olives and feta cheese tossed in extra-virgin olive oil and oregano.",
    ratings: 4.5, numOfReviews: 55,
    images: [{ public_id: "greek_salad", url: "https://images.unsplash.com/photo-1515516969-d4008cc6241a?w=400" }],
    restaurant: greenLeaf._id,
    reviews: [{ name: "Meera", rating: 5, Comment: "Very light and refreshing!" }],
  },
  {
    name: "Margherita Pizza",
    price: 280, stock: 10,
    description: "Thin-crust pizza with San Marzano tomato sauce, fresh mozzarella and basil leaves.",
    ratings: 4.6, numOfReviews: 90,
    images: [{ public_id: "margherita_pizza", url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400" }],
    restaurant: greenLeaf._id,
    reviews: [{ name: "Ravi", rating: 5, Comment: "The cheese pull is magical!" }],
  },
  {
    name: "Green Smoothie",
    price: 140, stock: 20,
    description: "Kale, spinach, banana, almond milk and chia seeds blended to a creamy green drink.",
    ratings: 4.4, numOfReviews: 65,
    images: [{ public_id: "green_smoothie", url: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400" }],
    restaurant: greenLeaf._id,
    reviews: [{ name: "Priya", rating: 4, Comment: "Surprisingly tasty and filling!" }],
  },
  {
    name: "Acai Bowl",
    price: 220, stock: 12,
    description: "Thick blended acai berry base topped with fresh granola, banana, blueberries and honey drizzle.",
    ratings: 4.7, numOfReviews: 70,
    images: [{ public_id: "acai_bowl", url: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400" }],
    restaurant: greenLeaf._id,
    reviews: [{ name: "Sneha", rating: 5, Comment: "Beautiful and delicious!" }],
  },
  {
    name: "Vegan Brownie",
    price: 120, stock: 20,
    description: "Rich dark-chocolate brownie made without dairy or eggs — fudgy, dense and totally satisfying.",
    ratings: 4.5, numOfReviews: 50,
    images: [{ public_id: "vegan_brownie", url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400" }],
    restaurant: greenLeaf._id,
    reviews: [{ name: "Kumar", rating: 5, Comment: "Can't believe it's vegan!" }],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 🌊  COASTAL KITCHEN — Kerala Seafood
  // ══════════════════════════════════════════════════════════════════════════
  {
    name: "Kerala Fish Curry",
    price: 320, stock: 12,
    description: "Fresh kingfish simmered in tangy coconut-tamarind gravy with raw mango and kudampuli.",
    ratings: 4.9, numOfReviews: 180,
    images: [{ public_id: "kerala_fish_curry", url: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400" }],
    restaurant: coastalKitchen._id,
    reviews: [{ name: "Thomas", rating: 5, Comment: "Absolutely authentic Kerala taste!" }],
  },
  {
    name: "Prawn Masala",
    price: 350, stock: 10,
    description: "Jumbo prawns cooked in a fiery onion-tomato masala with coastal spices and fresh curry leaves.",
    ratings: 4.8, numOfReviews: 140,
    images: [{ public_id: "prawn_masala", url: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400" }],
    restaurant: coastalKitchen._id,
    reviews: [{ name: "Anu", rating: 5, Comment: "Prawns were huge and perfectly spiced!" }],
  },
  {
    name: "Fish Fry (Pomfret)",
    price: 280, stock: 12,
    description: "Whole pomfret marinated in red chilli paste and pan-fried to a golden crisp.",
    ratings: 4.7, numOfReviews: 110,
    images: [{ public_id: "fish_fry", url: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400" }],
    restaurant: coastalKitchen._id,
    reviews: [{ name: "Thomas", rating: 5, Comment: "Crispy skin, flaky inside!" }],
  },
  {
    name: "Crab Roast",
    price: 420, stock: 8,
    description: "Backwater crab dry-roasted with shallots, fresh coconut and aromatic Kerala spices.",
    ratings: 4.9, numOfReviews: 95,
    images: [{ public_id: "crab_roast", url: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400" }],
    restaurant: coastalKitchen._id,
    reviews: [{ name: "Anu", rating: 5, Comment: "Worth every rupee!" }],
  },
  {
    name: "Appam with Stew",
    price: 130, stock: 20,
    description: "Lacy rice-coconut hoppers served with mild white vegetable and chicken coconut stew.",
    ratings: 4.8, numOfReviews: 160,
    images: [{ public_id: "appam_stew", url: "https://images.unsplash.com/photo-1630409351241-e90e7c7e9af0?w=400" }],
    restaurant: coastalKitchen._id,
    reviews: [{ name: "Ravi", rating: 5, Comment: "The combination is divine!" }],
  },
  {
    name: "Puttu & Kadala Curry",
    price: 110, stock: 20,
    description: "Steamed rice flour cylinder with coconut layers served with spicy black chickpea curry.",
    ratings: 4.6, numOfReviews: 85,
    images: [{ public_id: "puttu_kadala", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400" }],
    restaurant: coastalKitchen._id,
    reviews: [{ name: "Priya", rating: 4, Comment: "Traditional Kerala breakfast done right!" }],
  },
  {
    name: "Tender Coconut Water",
    price: 60, stock: 30,
    description: "Fresh tender coconut water served chilled — nature's best hydrator straight from the coast.",
    ratings: 4.8, numOfReviews: 200,
    images: [{ public_id: "coconut_water", url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400" }],
    restaurant: coastalKitchen._id,
    reviews: [{ name: "Thomas", rating: 5, Comment: "Nothing beats fresh coconut water!" }],
  },
  {
    name: "Payasam",
    price: 100, stock: 20,
    description: "Kerala's festival dessert — vermicelli or rice cooked in sweetened coconut milk with cardamom.",
    ratings: 4.7, numOfReviews: 75,
    images: [{ public_id: "payasam", url: "https://images.unsplash.com/photo-1571197119738-dcc8b27a3c83?w=400" }],
    restaurant: coastalKitchen._id,
    reviews: [{ name: "Anu", rating: 5, Comment: "Tastes like Onam sadya!" }],
  },
]);

console.log(`✅ ${foodItems.length} food items created.\n`);

// Helper: find food items for a specific restaurant
const itemsFor = (restaurantId) =>
  foodItems.filter((f) => f.restaurant.toString() === restaurantId.toString());

// ─── 3. MENUS ────────────────────────────────────────────────────────────────
console.log("📋 Seeding menus...");

// ── Spice Garden Menu ──────────────────────────────────────────────────────
const sgItems = itemsFor(spiceGarden._id);
const sg = {
  chickenBiryani: sgItems.find(i => i.name === "Chicken Biryani"),
  butterChicken:  sgItems.find(i => i.name === "Butter Chicken"),
  mutton:         sgItems.find(i => i.name === "Mutton Rogan Josh"),
  chicken65:      sgItems.find(i => i.name === "Chicken 65"),
  garlicNaan:     sgItems.find(i => i.name === "Garlic Naan"),
  lacchaParatha:  sgItems.find(i => i.name === "Laccha Paratha"),
  mangoLassi:     sgItems.find(i => i.name === "Mango Lassi"),
  gulabJamun:     sgItems.find(i => i.name === "Gulab Jamun"),
};
await Menu.create({
  restaurant: spiceGarden._id,
  menu: [
    { category: "Starters",    items: [sg.chicken65._id] },
    { category: "Main Course", items: [sg.chickenBiryani._id, sg.butterChicken._id, sg.mutton._id] },
    { category: "Breads",      items: [sg.garlicNaan._id, sg.lacchaParatha._id] },
    { category: "Beverages",   items: [sg.mangoLassi._id] },
    { category: "Desserts",    items: [sg.gulabJamun._id] },
  ],
});
console.log("  ✅ Spice Garden menu created");

// ── Veg Paradise Menu ──────────────────────────────────────────────────────
const vpItems = itemsFor(vegParadise._id);
const vp = {
  paneerTikka:  vpItems.find(i => i.name === "Paneer Tikka"),
  springRolls:  vpItems.find(i => i.name === "Veg Spring Rolls"),
  dalMakhani:   vpItems.find(i => i.name === "Dal Makhani"),
  palakPaneer:  vpItems.find(i => i.name === "Palak Paneer"),
  masalaDosa:   vpItems.find(i => i.name === "Masala Dosa"),
  idliSambar:   vpItems.find(i => i.name === "Idli Sambar"),
  limeSoda:     vpItems.find(i => i.name === "Fresh Lime Soda"),
  kheer:        vpItems.find(i => i.name === "Kheer"),
};
await Menu.create({
  restaurant: vegParadise._id,
  menu: [
    { category: "Starters",     items: [vp.paneerTikka._id, vp.springRolls._id] },
    { category: "Main Course",  items: [vp.dalMakhani._id, vp.palakPaneer._id] },
    { category: "South Indian", items: [vp.masalaDosa._id, vp.idliSambar._id] },
    { category: "Beverages",    items: [vp.limeSoda._id] },
    { category: "Desserts",     items: [vp.kheer._id] },
  ],
});
console.log("  ✅ Veg Paradise menu created");

// ── Mumbai Bites Menu ──────────────────────────────────────────────────────
const mbItems = itemsFor(mumbaiBites._id);
const mb = {
  vadaPav:       mbItems.find(i => i.name === "Vada Pav"),
  pavBhaji:      mbItems.find(i => i.name === "Pav Bhaji"),
  bhelPuri:      mbItems.find(i => i.name === "Bhel Puri"),
  sevPuri:       mbItems.find(i => i.name === "Sev Puri"),
  chickenFrank:  mbItems.find(i => i.name === "Chicken Frankie"),
  coldCoffee:    mbItems.find(i => i.name === "Cold Coffee"),
  cuttingChai:   mbItems.find(i => i.name === "Cutting Chai"),
};
await Menu.create({
  restaurant: mumbaiBites._id,
  menu: [
    { category: "Street Food",   items: [mb.vadaPav._id, mb.pavBhaji._id, mb.bhelPuri._id, mb.sevPuri._id] },
    { category: "Rolls & Wraps", items: [mb.chickenFrank._id] },
    { category: "Beverages",     items: [mb.coldCoffee._id, mb.cuttingChai._id] },
  ],
});
console.log("  ✅ Mumbai Bites menu created");

// ── Royal Tandoor Menu ─────────────────────────────────────────────────────
const rtItems = itemsFor(royalTandoor._id);
const rt = {
  seekhKebab:      rtItems.find(i => i.name === "Seekh Kebab"),
  tandooriChicken: rtItems.find(i => i.name === "Tandoori Chicken"),
  paneerTikka:     rtItems.find(i => i.name === "Paneer Tikka"),
  dalBukhara:      rtItems.find(i => i.name === "Dal Bukhara"),
  butterNaan:      rtItems.find(i => i.name === "Butter Naan"),
  lambBiryani:     rtItems.find(i => i.name === "Lamb Biryani"),
  roseSharbat:     rtItems.find(i => i.name === "Rose Sharbat"),
  phirni:          rtItems.find(i => i.name === "Phirni"),
};
await Menu.create({
  restaurant: royalTandoor._id,
  menu: [
    { category: "Tandoor Starters", items: [rt.seekhKebab._id, rt.tandooriChicken._id, rt.paneerTikka._id] },
    { category: "Main Course",      items: [rt.dalBukhara._id, rt.lambBiryani._id] },
    { category: "Breads",           items: [rt.butterNaan._id] },
    { category: "Beverages",        items: [rt.roseSharbat._id] },
    { category: "Desserts",         items: [rt.phirni._id] },
  ],
});
console.log("  ✅ Royal Tandoor menu created");

// ── Green Leaf Cafe Menu ───────────────────────────────────────────────────
const glItems = itemsFor(greenLeaf._id);
const gl = {
  avocadoToast:   glItems.find(i => i.name === "Avocado Toast"),
  hummusPlatter:  glItems.find(i => i.name === "Hummus Platter"),
  buddhaBowl:     glItems.find(i => i.name === "Buddha Bowl"),
  greekSalad:     glItems.find(i => i.name === "Greek Salad"),
  margheritaPizza:glItems.find(i => i.name === "Margherita Pizza"),
  greenSmoothie:  glItems.find(i => i.name === "Green Smoothie"),
  acaiBowl:       glItems.find(i => i.name === "Acai Bowl"),
  veganBrownie:   glItems.find(i => i.name === "Vegan Brownie"),
};
await Menu.create({
  restaurant: greenLeaf._id,
  menu: [
    { category: "Starters & Snacks", items: [gl.avocadoToast._id, gl.hummusPlatter._id] },
    { category: "Bowls & Salads",    items: [gl.buddhaBowl._id, gl.greekSalad._id] },
    { category: "Mains",             items: [gl.margheritaPizza._id] },
    { category: "Smoothies",         items: [gl.greenSmoothie._id, gl.acaiBowl._id] },
    { category: "Desserts",          items: [gl.veganBrownie._id] },
  ],
});
console.log("  ✅ Green Leaf Cafe menu created");

// ── Coastal Kitchen Menu ───────────────────────────────────────────────────
const ckItems = itemsFor(coastalKitchen._id);
const ck = {
  fishCurry:      ckItems.find(i => i.name === "Kerala Fish Curry"),
  prawnMasala:    ckItems.find(i => i.name === "Prawn Masala"),
  fishFry:        ckItems.find(i => i.name === "Fish Fry (Pomfret)"),
  crabRoast:      ckItems.find(i => i.name === "Crab Roast"),
  appam:          ckItems.find(i => i.name === "Appam with Stew"),
  puttu:          ckItems.find(i => i.name === "Puttu & Kadala Curry"),
  coconutWater:   ckItems.find(i => i.name === "Tender Coconut Water"),
  payasam:        ckItems.find(i => i.name === "Payasam"),
};
await Menu.create({
  restaurant: coastalKitchen._id,
  menu: [
    { category: "Seafood Starters", items: [ck.fishFry._id] },
    { category: "Seafood Mains",    items: [ck.fishCurry._id, ck.prawnMasala._id, ck.crabRoast._id] },
    { category: "Kerala Breakfast", items: [ck.appam._id, ck.puttu._id] },
    { category: "Beverages",        items: [ck.coconutWater._id] },
    { category: "Desserts",         items: [ck.payasam._id] },
  ],
});
console.log("  ✅ Coastal Kitchen menu created");

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log("\n" + "━".repeat(55));
console.log("🎉 DATABASE SEEDED SUCCESSFULLY!");
console.log("━".repeat(55));
console.log(`  Restaurants : ${restaurants.length}`);
console.log(`  Food Items  : ${foodItems.length}`);
console.log(`  Menus       : 6`);
console.log("━".repeat(55));
console.log("\n🔗 Restaurant IDs (test menus in browser):");
restaurants.forEach((r) =>
  console.log(`  ${r.name.padEnd(24)} → ${r._id}`)
);
console.log("\n🌐 URLs to test:");
restaurants.forEach((r) =>
  console.log(`  http://localhost:5173/eats/stores/${r._id}/menus`)
);

await mongoose.disconnect();
process.exit(0);
