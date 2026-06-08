const Product = require("../../models/Products");

const COLOR_ALIASES = {
  black: ["black", "dark"],
  white: ["white", "light"],
  gray: ["gray", "grey", "silver"],
  red: ["red", "maroon", "burgundy"],
  orange: ["orange", "peach"],
  yellow: ["yellow", "gold"],
  green: ["green", "olive"],
  cyan: ["cyan", "teal", "aqua"],
  blue: ["blue", "navy"],
  purple: ["purple", "violet", "lavender"],
  pink: ["pink", "rose"],
  brown: ["brown", "tan", "beige", "cream"],
};

const STOP_WORDS = new Set([
  "image",
  "photo",
  "picture",
  "product",
  "upload",
  "img",
  "jpg",
  "jpeg",
  "png",
  "webp",
  "avif",
  "heic",
  "copy",
]);

function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeToken(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function uniqueKeywords(values) {
  const keywords = [];
  const seen = new Set();

  values
    .flatMap((value) => normalizeToken(value).split(/\s+/))
    .filter((value) => value.length >= 2 && !STOP_WORDS.has(value))
    .forEach((value) => {
      if (!seen.has(value)) {
        seen.add(value);
        keywords.push(value);
      }
    });

  return keywords;
}

function parseClientFeatures(rawFeatures) {
  if (!rawFeatures) return {};

  try {
    return typeof rawFeatures === "string" ? JSON.parse(rawFeatures) : rawFeatures;
  } catch (err) {
    return {};
  }
}

function getKeywordsFromUpload(req) {
  const features = parseClientFeatures(req.body?.features);
  const fileName = req.file?.originalname || "";
  const color = normalizeToken(features.colorFamily);
  const aliases = COLOR_ALIASES[color] || [];

  return uniqueKeywords([
    fileName,
    color,
    ...aliases,
    features.brightness,
    features.saturation,
    features.orientation,
    ...(Array.isArray(features.labels) ? features.labels : []),
  ]).slice(0, 16);
}

function productSearchText(product) {
  return normalizeToken(
    [
      product.title,
      product.description,
      product.category,
      product.brand,
      ...(product.tags || []),
    ].join(" ")
  );
}

function scoreProduct(product, keywords) {
  const text = productSearchText(product);
  let score = 0;

  keywords.forEach((keyword) => {
    if (!keyword) return;

    const tokenRegExp = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "i");

    if (tokenRegExp.test(product.title || "")) score += 8;
    if (tokenRegExp.test(product.brand || "")) score += 7;
    if (tokenRegExp.test(product.category || "")) score += 6;
    if ((product.tags || []).some((tag) => tokenRegExp.test(tag))) score += 6;
    if (tokenRegExp.test(product.description || "")) score += 3;
    if (text.includes(keyword)) score += 1;
  });

  if ((product.totalStock || 0) > 0) score += 1;

  return score;
}

async function getCandidateProducts(keywords) {
  if (!keywords.length) {
    return [];
  }

  const regEx = new RegExp(keywords.map(escapeRegExp).join("|"), "i");

  const candidates = await Product.find({
    $or: [
      { title: regEx },
      { description: regEx },
      { category: regEx },
      { brand: regEx },
      { tags: regEx },
    ],
  }).limit(60);

  return candidates;
}

/**
 * POST /api/shop/search/image
 * Body: multipart/form-data with field "image" and optional JSON field "features".
 *
 * This is an API-key-free visual search fallback. The browser extracts simple
 * image features with canvas, then the server scores products against those
 * features, the filename, and existing product tags/text.
 */
const imageSearchProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided. Send a file under the 'image' field.",
      });
    }

    const keywords = getKeywordsFromUpload(req);

    if (!keywords.length) {
      return res.status(200).json({
        success: true,
        data: [],
        tagRelated: [],
        concepts: [],
        message: "Could not extract recognizable features from the image.",
      });
    }

    const candidates = await getCandidateProducts(keywords);
    const scoredProducts = candidates
      .map((product) => ({ product, score: scoreProduct(product, keywords) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ product }) => product);

    const searchResults = scoredProducts.slice(0, 20);
    const resultIds = new Set(searchResults.map((p) => p._id.toString()));
    const allTags = [...new Set(searchResults.flatMap((p) => p.tags || []))];

    let tagRelated = [];
    if (allTags.length > 0) {
      tagRelated = await Product.find({
        tags: { $in: allTags },
        _id: { $nin: [...resultIds] },
        totalStock: { $gt: 0 },
      }).limit(12);
    }

    return res.status(200).json({
      success: true,
      data: searchResults,
      tagRelated,
      concepts: keywords.slice(0, 10),
    });
  } catch (err) {
    console.error("Image search error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error during image search.",
    });
  }
};

module.exports = { imageSearchProducts };
