const express = require("express");
const {
  getAllOrdersOfAllUsers,
  getOrdersDetailsAdmin,
  updateOrderStatus,
} = require("../../controllers/admin/order-controller-admin");

const router = express.Router();

router.get("/get", getAllOrdersOfAllUsers);
router.get("/details/:id", getOrdersDetailsAdmin);
router.put("/update/:id", updateOrderStatus);
module.exports = router;
