const mongoose = require("mongoose");

/**
 * Tracks which products a user has viewed.
 * Each view is a separate record; the recommendation engine
 * aggregates by product to find most-viewed categories/brands.
 */
const BrowsingHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    productId: {
      type: String,
      required: true,
    },
    category: { type: String, default: "" },
    brand: { type: String, default: "" },
    price: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Compound index for fast per-user lookups
BrowsingHistorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("BrowsingHistory", BrowsingHistorySchema);
