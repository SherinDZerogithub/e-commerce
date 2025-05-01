const Product = require("../../models/Products");
//The Product model is defined using Mongoose, which provides:
//Schema: Defines the structure of product documents
//

const getFilterProducts = async (req, res) => {
  // 1. Extract query parameters
  // 2. Build filters object
  // 3. Build sort object
  // 4. Execute database query
  // 5. Return response
  //Parses query parameters:
  const { category = "", brand = "", sortBy = "price-lowtohigh" } = req.query;
  //req.query contains the URL query parameters (after the ? in the URL)

  //Builds MongoDB query:
  let filters = {};

  if (category) {
    filters.category = { $in: category.split(",") };
  }

  //filters will be used in the MongoDB query
  //$in is a MongoDB operator that means "match any of these values"
  //category.split(",") converts "cat1,cat2" into ["cat1", "cat2"]
  if (brand) {
    filters.brand = { $in: brand.split(",") };
  }

  let sort = {};

  //1 means ascending, -1 means descending
  //Applies sorting
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
