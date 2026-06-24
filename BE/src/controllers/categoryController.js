const { Category } = require("../models");

const getAll = async (req, res, next) => {
  try {
    const categories = await Category.find().sort("name");
    res.json({ success: true, data: categories });
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, data: category });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const category = await Category.create({ name: req.body.name });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: "Category name already exists" });
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, data: category });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, message: "Category deleted" });
  } catch (err) { next(err); }
};

module.exports = { getAll, getOne, create, update, remove };
