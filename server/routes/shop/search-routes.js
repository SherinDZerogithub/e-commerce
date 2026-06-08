const express = require("express");
const {
  searchProducts
} = require("../../controllers/shop/search-controller");
const { imageSearchProducts } = require("../../controllers/shop/image-search-controller");
const { upload } = require("../../helpers/cloudinary");

const router = express.Router();

// Text search: GET /api/shop/search/:keyword
router.get("/:keyword", searchProducts);

// Image (visual) search: POST /api/shop/search/image
// Accepts multipart/form-data with a single file field named "image"
router.post("/image", upload.single("image"), imageSearchProducts);

module.exports = router;
