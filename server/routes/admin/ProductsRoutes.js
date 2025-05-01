const express = require("express");
const {
  handleImageUploads,
  fetchAllProducts,
  addProduct,
  deletehAllProducts,
  editAllProducts,
} = require("../../controllers/admin/productsController");

// ✅ Corrected import
const { upload } = require("../../helpers/cloudinary");


const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUploads);
router.post("/add", addProduct);
router.put("/edit/:id", editAllProducts);
router.delete("/delete/:id", deletehAllProducts);
router.get("/get", fetchAllProducts);
module.exports = router;
