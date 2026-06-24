const { Variant, Product } = require("../models");

const getByProduct = async (req, res, next) => {
  try {
    const variants = await Variant.find({ product: req.params.productId });
    res.json({ success: true, data: variants });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.productId, seller: req.user.id });
    if (!product) return res.status(404).json({ success: false, message: "Product not found or not authorized" });

    const variant = await Variant.create({ ...req.body, product: product._id });
    res.status(201).json({ success: true, data: variant });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const variant = await Variant.findById(req.params.id).populate("product");
    if (!variant) return res.status(404).json({ success: false, message: "Variant not found" });
    if (variant.product.seller.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: "Not authorized" });

    Object.assign(variant, req.body);
    await variant.save();
    res.json({ success: true, data: variant });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const variant = await Variant.findById(req.params.id).populate("product");
    if (!variant) return res.status(404).json({ success: false, message: "Variant not found" });
    if (variant.product.seller.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: "Not authorized" });

    await variant.deleteOne();
    res.json({ success: true, message: "Variant deleted" });
  } catch (err) { next(err); }
};

module.exports = { getByProduct, create, update, remove };
