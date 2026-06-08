const express = require("express");
const {
  getAllFeatures,
  addFeature,
  editFeature,
  deleteFeature,
} = require("../../controllers/admin/feature-controller");

const router = express.Router();

router.get("/get", getAllFeatures);
router.post("/add", addFeature);
router.put("/edit/:id", editFeature);
router.delete("/delete/:id", deleteFeature);

module.exports = router;
