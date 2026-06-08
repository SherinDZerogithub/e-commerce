const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: { type: Number, default: 0 },
    /**
     * Free-form tags used for search and recommendation boosting.
     * Example: ["summer", "casual", "slim-fit", "cotton"]
     */
    tags: {
      type: [String],
      default: [],
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
