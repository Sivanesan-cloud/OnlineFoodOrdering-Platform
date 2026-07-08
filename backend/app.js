import express from "express";
import path from "path";
import { fileURLToPath } from "url"; // Required to recreate __dirname in ESM
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";

// Custom Error Handler and Middleware Imports
import ErrorHandler from "./utils/errorHandler.js"; // Added missing import to prevent crashes
import errorMiddleware from "./middlewares/errors.js";

// Routes Imports (All appended with mandatory .js extensions)
import foodRouter from "./routes/foodItem.js";
import restaurant from "./routes/restaurant.js";
import menuRouter from "./routes/menu.js";
import order from "./routes/order.js";
import auth from "./routes/auth.js";
import payment from "./routes/payment.js";
import cart from "./routes/cart.js";

const app = express();

// Recreating __dirname utility for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares configuration
app.use(cors());
app.use(cookieParser());
app.use(fileUpload());

app.use(express.json({ limit: "30kb" }));
app.use(express.urlencoded({ extended: true, limit: "30kb" }));

// Routes mounting
// NOTE: Vite proxy strips the /api prefix before forwarding to this server,
// so all routes must be mounted WITHOUT the /api prefix.
app.use("/v1/eats", foodRouter);
// menuRouter is nested inside restaurant via /:storeId/menus — no standalone mount needed
app.use("/v1/eats/stores", restaurant);
app.use("/v1/eats/orders", order);
app.use("/v1/users", auth);
app.use("/v1", payment);
app.use("/v1/eats/cart", cart);

// View Engine setup
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 404 Handler
app.use((req, res, next) => {
  next(new ErrorHandler(`Route ${req.originalUrl} not found`, 404));
});

// Global Error Handler
app.use(errorMiddleware);

// Converted to ES Module default export
export default app;