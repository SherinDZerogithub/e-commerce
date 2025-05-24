const Product = require("../../models/Products");


const getFilterProducts = async (req, res) => {
 
  const { category = "", brand = "", sortBy = "price-lowtohigh" } = req.query;

  let filters = {};

  if (category) {
    filters.category = { $in: category.split(",") };
  }

  
  if (brand) {
    filters.brand = { $in: brand.split(",") };
  }

  let sort = {};

 
  switch (sortBy) {
    case "price-lowtohigh":
      sort.price = 1;
      break;

    case "price-hightolow":
      sort.price = -1;
      break;

    case "title-atoz":
      sort.title = 1;
      break;

    case "title-ztoa":
      sort.title = -1;
      break;

    default:
      sort.price = 1;
      break;
  }

  try {
    //Executes query
    const products = await Product.find(filters).sort(sort);
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching products",
    });
  }
};

const getProductsDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    console.error("Error fetching product details:", e);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching product details",
    });
  }
};


module.exports = { getFilterProducts, getProductsDetails };
