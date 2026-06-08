const Feature = require("../../models/Feature");

/** GET /api/admin/features — return all banners sorted by order */
const getAllFeatures = async (req, res) => {
  try {
    const features = await Feature.find({}).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: features });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching features" });
  }
};

/** POST /api/admin/features/add */
const addFeature = async (req, res) => {
  try {
    const { image, title, subtitle, isActive, order } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }
    const feature = new Feature({ image, title, subtitle, isActive, order });
    await feature.save();
    res.status(201).json({ success: true, data: feature });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error adding feature" });
  }
};

/** PUT /api/admin/features/edit/:id */
const editFeature = async (req, res) => {
  try {
    const { id } = req.params;
    const { image, title, subtitle, isActive, order } = req.body;

    const feature = await Feature.findById(id);
    if (!feature) {
      return res.status(404).json({ success: false, message: "Feature not found" });
    }

    if (image !== undefined) feature.image = image;
    if (title !== undefined) feature.title = title;
    if (subtitle !== undefined) feature.subtitle = subtitle;
    if (isActive !== undefined) feature.isActive = isActive;
    if (order !== undefined) feature.order = order;

    await feature.save();
    res.status(200).json({ success: true, data: feature });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error editing feature" });
  }
};

/** DELETE /api/admin/features/delete/:id */
const deleteFeature = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Feature.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Feature not found" });
    }
    res.status(200).json({ success: true, message: "Feature deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting feature" });
  }
};

/** GET /api/shop/features — public endpoint: only active banners */
const getActiveFeatures = async (req, res) => {
  try {
    const features = await Feature.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: features });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching features" });
  }
};

module.exports = { getAllFeatures, addFeature, editFeature, deleteFeature, getActiveFeatures };
