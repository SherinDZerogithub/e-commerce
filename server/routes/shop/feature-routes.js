const express = require("express");
const { getActiveFeatures } = require("../../controllers/admin/feature-controller");

const router = express.Router();

router.get("/get", getActiveFeatures);

module.exports = router;
