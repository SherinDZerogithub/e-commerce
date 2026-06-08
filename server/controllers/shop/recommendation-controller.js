const Product = require("../../models/Products");
const Order = require("../../models/Order");
const BrowsingHistory = require("../../models/BrowsingHistory");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CATEGORIES = ["men", "women", "kids", "accessories", "footwear"];
const BRANDS = ["nike", "adidas", "puma", "levi", "zara", "h&m"];

/**
 * Collect all unique tags across a list of products so we can build a
 * consistent tag dimension for every feature vector.
 */
function collectAllTags(products) {
  const tagSet = new Set();
  for (const p of products) {
    for (const t of p.tags || []) tagSet.add(t.toLowerCase());
  }
  return [...tagSet].sort(); // sorted for deterministic ordering
}

/**
 * Builds a feature vector for a product.
 * Dimensions:
 *   - category one-hot  (CATEGORIES.length)
 *   - brand one-hot     (BRANDS.length)
 *   - normalised price  (1)
 *   - tag one-hot       (allTags.length)  ← NEW
 */
function buildVector(product, maxPrice, allTags) {
  const categoryVec = CATEGORIES.map((c) =>
    c === (product.category || "").toLowerCase() ? 1 : 0
  );
  const brandVec = BRANDS.map((b) =>
    b === (product.brand || "").toLowerCase() ? 1 : 0
  );
  const priceNorm = maxPrice > 0 ? (product.price || 0) / maxPrice : 0;

  // Tag dimensions — weight tags slightly higher to give them more influence
  const productTags = new Set((product.tags || []).map((t) => t.toLowerCase()));
  const tagVec = allTags.map((t) => (productTags.has(t) ? 1.5 : 0));

  return [...categoryVec, ...brandVec, priceNorm, ...tagVec];
}

function cosineSimilarity(a, b) {
  let dot = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ---------------------------------------------------------------------------
// Track a product view
// ---------------------------------------------------------------------------
const trackProductView = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ success: false, message: "userId and productId required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    await BrowsingHistory.create({
      userId,
      productId,
      category: product.category,
      brand: product.brand,
      price: product.price,
      tags: product.tags || [],
    });

    res.status(201).json({ success: true, message: "View tracked" });
  } catch (e) {
    console.error("trackProductView error:", e);
    res.status(500).json({ success: false, message: "Error tracking view" });
  }
};

// ---------------------------------------------------------------------------
// Get recommendations for a user
// ---------------------------------------------------------------------------
const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 8;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "userId required" });
    }

    // ── 1. Gather user signal ────────────────────────────────────────────────
    // Browsing history (last 50 views)
    const browsingDocs = await BrowsingHistory.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Past orders
    const orders = await Order.find({ userId }).lean();
    const orderedItems = orders.flatMap((o) => o.cartItems || []);

    // IDs already interacted with (viewed OR ordered) — exclude from results
    const interactedProductIds = new Set([
      ...browsingDocs.map((b) => b.productId),
      ...orderedItems.map((i) => i.productId),
    ]);

    // ── 2. Build a user interest profile ────────────────────────────────────
    // Score each category, brand, and tag by frequency (views ×1, orders ×2)
    const categoryScore = {};
    const brandScore = {};
    const tagScore = {};

    for (const b of browsingDocs) {
      if (b.category) categoryScore[b.category] = (categoryScore[b.category] || 0) + 1;
      if (b.brand) brandScore[b.brand] = (brandScore[b.brand] || 0) + 1;
      for (const t of b.tags || []) {
        tagScore[t] = (tagScore[t] || 0) + 1;
      }
    }
    for (const item of orderedItems) {
      if (item.category) categoryScore[item.category] = (categoryScore[item.category] || 0) + 2;
      if (item.brand) brandScore[item.brand] = (brandScore[item.brand] || 0) + 2;
    }

    // ── 3. Cold start: no history → return popular / featured products ───────
    const hasHistory = browsingDocs.length > 0 || orderedItems.length > 0;
    if (!hasHistory) {
      const popular = await Product.find({ totalStock: { $gt: 0 } })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      return res.status(200).json({
        success: true,
        data: popular,
        source: "popular",
      });
    }

    // ── 4. Fetch all available (in-stock) products not yet interacted ────────
    const allProducts = await Product.find({ totalStock: { $gt: 0 } }).lean();

    const candidates = allProducts.filter(
      (p) => !interactedProductIds.has(p._id.toString())
    );

    if (candidates.length === 0) {
      // Fall back to in-stock products regardless of history
      const fallback = await Product.find({ totalStock: { $gt: 0 } })
        .limit(limit)
        .lean();
      return res.status(200).json({
        success: true,
        data: fallback,
        source: "fallback",
      });
    }

    // ── 5. Build a "user vector" from profile and score each candidate ───────
    const maxPrice = Math.max(...allProducts.map((p) => p.price || 0), 1);
    const allTags = collectAllTags(allProducts);

    // Synthesise a pseudo-product that represents user preferences
    const topCategory = Object.entries(categoryScore).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
    const topBrand = Object.entries(brandScore).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
    // Top tags: pick the 5 most-viewed tags for the pseudo-product vector
    const topTags = Object.entries(tagScore)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);
    const avgPrice =
      browsingDocs.reduce((sum, b) => sum + (b.price || 0), 0) /
      (browsingDocs.length || 1);

    const userPseudoProduct = {
      category: topCategory,
      brand: topBrand,
      price: avgPrice,
      tags: topTags,
    };
    const userVec = buildVector(userPseudoProduct, maxPrice, allTags);

    // Score candidates by cosine similarity + explicit category/brand/tag bonus
    const scored = candidates.map((product) => {
      const productVec = buildVector(product, maxPrice, allTags);
      let score = cosineSimilarity(userVec, productVec);

      // Explicit interest bonuses
      const catBonus = (categoryScore[product.category] || 0) * 0.15;
      const brandBonus = (brandScore[product.brand] || 0) * 0.1;
      // Tag bonus: sum scores for each matching tag
      const tagBonus = (product.tags || []).reduce(
        (sum, t) => sum + (tagScore[t] || 0) * 0.12,
        0
      );
      score += catBonus + brandBonus + tagBonus;

      return { product, score };
    });

    // Sort descending, take top N
    scored.sort((a, b) => b.score - a.score);
    const recommendations = scored.slice(0, limit).map((s) => s.product);

    res.status(200).json({
      success: true,
      data: recommendations,
      source: "personalized",
    });
  } catch (e) {
    console.error("getRecommendations error:", e);
    res.status(500).json({
      success: false,
      message: "Error fetching recommendations",
    });
  }
};

// ---------------------------------------------------------------------------
// Similar products (for product detail page)
// ---------------------------------------------------------------------------
const getSimilarProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const limit = parseInt(req.query.limit) || 6;

    const sourceProduct = await Product.findById(productId).lean();
    if (!sourceProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const allProducts = await Product.find({
      _id: { $ne: productId },
      totalStock: { $gt: 0 },
    }).lean();

    if (allProducts.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const maxPrice = Math.max(...allProducts.map((p) => p.price || 0), sourceProduct.price || 1);
    const allTags = collectAllTags([sourceProduct, ...allProducts]);
    const sourceVec = buildVector(sourceProduct, maxPrice, allTags);

    const scored = allProducts.map((product) => ({
      product,
      score: cosineSimilarity(sourceVec, buildVector(product, maxPrice, allTags)),
    }));

    scored.sort((a, b) => b.score - a.score);
    const similar = scored.slice(0, limit).map((s) => s.product);

    res.status(200).json({ success: true, data: similar });
  } catch (e) {
    console.error("getSimilarProducts error:", e);
    res.status(500).json({
      success: false,
      message: "Error fetching similar products",
    });
  }
};

module.exports = { trackProductView, getRecommendations, getSimilarProducts };
