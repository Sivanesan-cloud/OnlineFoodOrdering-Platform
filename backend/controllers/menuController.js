// 🎯 STEP 1: Start with Real-Life Story (VERY IMPORTANT)

// 👩‍🏫 Say:

// “Guys, we already created Menu model…
// Now question is — how will frontend USE it?”

// 👉 Example:

// Show all menus
// Create a menu
// Delete menu
// Add items into menu

// 👉 These actions = Controllers (logic layer)

// 🧠 STEP 2: What We Are Building (NO CODE)

// 👩‍🏫 Ask:

// 👉 “If Swiggy/Zomato works… what operations happen?”

// Students will say:

// ✔ Show menu
// ✔ Add food
// ✔ Delete menu

// 👉 So today we will build:

// Get all menus
// Create menu
// Delete menu
// Add item to menu

import Menu from "../models/menu.js";
//Now we are importing ErrorHandler”
//ErrorHandler → custom error class
//used to create meaningful errors
//“Instead of showing random errors, we send clean messages”
// ❌ Normal error:
// Something went wrong
// ✅ With ErrorHandler:
// Menu not found

// 🎯 Ask:

// ❓ “Why custom error?”
// 👉 To control message + status code
import ErrorHandler from "../utils/errorHandler.js";

// 🧠 Break it:
// catch → catch error
// async → async function

// 👉 It handles async errors automatically

// 💡 Explain problem first:

// 👉 Normally:

// try {
//   // code
// } catch (error) {
//   next(error);
// }

// 👉 This is repetitive 😩

// 💡 Solution:

// 👉 With catchAsync:

// catchAsync(async (req, res, next) => {
//   // code
// });

// 👉 No need of try-catch

// 🍽️ Real-life Example:

// 👉 “Imagine a bodyguard 🛡️”

// You = writing logic
// Bodyguard = catchAsync

// 👉 If error comes → bodyguard handles it
import catchAsync from "../middlewares/catchAsyncErrors.js";

// GET ALL MENUS
export const getAllMenus = catchAsync(async (req, res, next) => {

  const filter = req.params.storeId
    ? { restaurant: req.params.storeId }
    : {};

  const menu = await Menu.find(filter).populate("menu.items");

  res.status(200).json({
    status: "success",
    count: menu.length,
    data: menu,
  });

});

// CREATE MENU
export const createMenu = catchAsync(async (req, res, next) => {

  const menu = await Menu.create(req.body);

  res.status(201).json({
    status: "success",
    data: menu,
  });

});

// DELETE MENU
export const deleteMenu = catchAsync(async (req, res, next) => {

  const menu = await Menu.findByIdAndDelete(req.params.menuId);

  if (!menu) {
    return next(new ErrorHandler("No document found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
  });

});

// ADD ITEM TO MENU
export const addItemToMenu = catchAsync(async (req, res, next) => {

  const { category, foodItemId } = req.body;
  const menuId = req.params.menuId;

  if (!menuId) {
    return next(new ErrorHandler("Menu ID is required", 400));
  }

  const menu = await Menu.findById(menuId);

  if (!menu) {
    return next(new ErrorHandler("Menu not found", 404));
  }

  // find category
  let cat = menu.menu.find((c) => c.category === category);

  // if not found, create new
  if (!cat) {
    cat = { category, items: [] };
    menu.menu.push(cat);
  }

  // add item
  cat.items.push(foodItemId);

  await menu.save();

  await menu.populate("menu.items");

  res.status(200).json({
    status: "success",
    data: menu,
  });

});