const express = require("express");
const {
  addProductsReview, getProductsReview 
} = require("../../controllers/shop/peoduct-review-controller");

const router = express.Router();

router.post("/add", addProductsReview);
router.get("/:productId", getProductsReview );
module.exports = router;
