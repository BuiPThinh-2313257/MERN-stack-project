const { SubCategory } = require("../models");

const getAll = async (req, res, next) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const subs = await SubCategory.find(filter).populate("category", "name").sort("name");
    res.json({ success: true, data: subs });
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const sub = await SubCategory.findById(req.params.id).populate("category", "name");
    if (!sub) return res.status(404).json({ success: false, message: "SubCategory not found" });
    res.json({ success: true, data: sub });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const sub = await SubCategory.create({ name: req.body.name, category: req.body.category });
    res.status(201).json({ success: true, data: sub });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: "SubCategory already exists in this category" });
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const sub = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!sub) return res.status(404).json({ success: false, message: "SubCategory not found" });
    res.json({ success: true, data: sub });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const sub = await SubCategory.findByIdAndDelete(req.params.id);
    if (!sub) return res.status(404).json({ success: false, message: "SubCategory not found" });
    res.json({ success: true, message: "SubCategory deleted" });
  } catch (err) { next(err); }
};

module.exports = { getAll, getOne, create, update, remove };
