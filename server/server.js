const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/ProductsRoutes");
const shopProductsRouter = require("./routes/shop/ProductRouteShop");
const shopCartsRouter = require("./routes/shop/cart-routes");

//create a db conn

mongoose
  .connect("")
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(err));

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
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

app.listen(PORT, () => console.log(`Server started at ${PORT}`));
