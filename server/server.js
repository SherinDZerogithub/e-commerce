require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/ProductsRoutes");
const shopProductsRouter = require("./routes/shop/ProductRouteShop");
const shopCartsRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const adminOrderRouter = require("./routes/admin/order-routes-admin");
const shopReviewRouter = require("./routes/shop/review-routes");
const shopRecommendationRouter = require("./routes/shop/recommendation-routes");
const adminAnalyticsRouter = require("./routes/admin/analytics-routes");
const adminFeatureRouter = require("./routes/admin/feature-routes");
const shopFeatureRouter = require("./routes/shop/feature-routes");

//create a db conn
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Missing MONGO_URI. Add it to server/.env before starting the server.");
  process.exit(1);
}

const mongooseOptions = {
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
};

mongoose
  .connect(MONGO_URI, mongooseOptions)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();

const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

for (const origin of ["http://127.0.0.1:5173", "http://localhost:5173"]) {
  if (!allowedOrigins.includes(origin)) allowedOrigins.push(origin);
}

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartsRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/orders", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/shop/reviews", shopReviewRouter);
app.use("/api/shop/recommendations", shopRecommendationRouter);
app.use("/api/admin/analytics", adminAnalyticsRouter);
app.use("/api/admin/features", adminFeatureRouter);
app.use("/api/shop/features", shopFeatureRouter);

app.listen(PORT, () => console.log(`Server started at ${PORT}`));
