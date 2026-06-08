const Product = require("../../models/Products");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message: "Keyword is required and must be a string",
      });
    }

    // Case-insensitive regex for main search
    const regEx = new RegExp(keyword, "i");

    const createSearchQuery = {
      $or: [
        { title: regEx },
        { description: regEx },
        { category: regEx },
        { brand: regEx },
        { tags: regEx }, // ← search tags array
      ],
    };

    const searchResults = await Product.find(createSearchQuery);

    // ── Tag-based related products ─────────────────────────────────────────
    // Collect all unique tags from search results, then find other products
    // that share at least one tag but weren't already in the main results.
    const searchResultIds = new Set(searchResults.map((p) => p._id.toString()));

    const allTags = [
      ...new Set(searchResults.flatMap((p) => p.tags || [])),
    ];

    let tagRelated = [];
    if (allTags.length > 0) {
      tagRelated = await Product.find({
        tags: { $in: allTags },
        _id: { $nin: [...searchResultIds] },
        totalStock: { $gt: 0 },
      }).limit(12);
    }

    res.status(200).json({
      success: true,
      data: searchResults,
      tagRelated,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { searchProducts };
