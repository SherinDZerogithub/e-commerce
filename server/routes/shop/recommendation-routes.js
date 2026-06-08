const express = require("express");
const {
  trackProductView,
  getRecommendations,
  getSimilarProducts,
} = require("../../controllers/shop/recommendation-controller");

const router = express.Router();

// POST /api/shop/recommendations/track
// Body: { userId, productId }
router.post("/track", trackProductView);

// GET /api/shop/recommendations/:userId?limit=8
// Returns personalised "You might also like" list
router.get("/:userId", getRecommendations);

// GET /api/shop/recommendations/similar/:productId?limit=6
// Returns products similar to a given product (for PDP)
router.get("/similar/:productId", getSimilarProducts);

module.exports = router;
