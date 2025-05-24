const express = require("express");
const {
  createOrder,
  capturePayment,
  getAllOrdersByUsers,
  getOrdersDetails,
} = require("../../controllers/shop/order-controllers");

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.get("/list/:userId", getAllOrdersByUsers);
router.get("/details/:id", getOrdersDetails);

module.exports = router;
