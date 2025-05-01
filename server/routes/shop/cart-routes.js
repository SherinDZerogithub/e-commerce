const express = require("express");
const {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
} = require("../../controllers/shop/createCartController");

const router = express.Router();
router.get("/get/:userId", fetchCartItems);
router.post("/add", addToCart);
router.put("/update-cart", updateCartItemQty);
router.delete("/:userId/:productId", deleteCartItem);

module.exports = router;
