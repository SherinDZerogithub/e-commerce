const { imageUploadUtils } = require("../../helpers/cloudinary");
const Product = require("../../models/Products");

const handleImageUploads = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtils(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};


/**
 * Normalise a tags value coming from the request body.
 * Accepts a comma-separated string ("summer, casual, slim-fit")
 * or an already-parsed array. Returns a trimmed, lower-cased array.
 */
function normaliseTags(raw) {
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : String(raw).split(",");
  return arr.map((t) => t.trim().toLowerCase()).filter(Boolean);
}

const addProduct = async (req, res) => {
 
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      tags,
    } = req.body;
    const newlyCreatedProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      tags: normaliseTags(tags),
    });

    await newlyCreatedProduct.save();
    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Ocuured",
    });
  }
};

const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Ocuured",
    });
  }
};


const editAllProducts = async (req, res) => {
  try {
   
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
      tags,
    } = req.body;

    const findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(400).json({
        success: false,
        message: "Product Not Found",
      });

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice =
      salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;
    findProduct.averageReview = averageReview || findProduct.averageReview;
    // Allow clearing tags by passing an empty string or empty array
    if (tags !== undefined) {
      findProduct.tags = normaliseTags(tags);
    }

    await findProduct.save();

    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Ocuured",
    });
  }
};



const deletehAllProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProducts = await Product.findByIdAndDelete(id);
    if (!deleteProducts)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Ocuured",
    });
  }
};

module.exports = {
  handleImageUploads,
  fetchAllProducts,
  addProduct,
  deletehAllProducts,
  editAllProducts,
};
