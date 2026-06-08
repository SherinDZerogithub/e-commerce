const express = require("express");
const { getAnalytics } = require("../../controllers/admin/analytics-controller");

const router = express.Router();

router.get("/", getAnalytics);

module.exports = router;
