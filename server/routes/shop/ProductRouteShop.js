const express = require("express");
const {
  getFilterProducts,
  getProductsDetails,
} = require("../../controllers/shop/productConrollerShop");

const router = express.Router();

router.get("/get", getFilterProducts);
router.get("/get/:id", getProductsDetails );
module.exports = router;
