const { Product, Variant } = require("../models");

const getAll = async (req, res, next) => {
  try {
    const {
      search,
      category,
      sub_category,
      seller,
      page = 1,
      limit = 20,
    } = req.query;
    const filter = { status: "active" };

    if (search) filter.$text = { $search: search };
    if (sub_category) filter.sub_category = sub_category;
    if (seller) filter.seller = seller;

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("seller", "name shop_name")
        .populate("sub_category", "name")
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller", "name shop_name avatar_url")
      .populate("sub_category", "name category");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    const variants = await Variant.find({ product: product._id });
    res.json({
      success: true,
      data: { ...product.toObject(), variants },
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const product = await Product.create({ ...req.body, seller: req.user.id });
    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user.id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    Object.assign(product, req.body);
    await product.save();

    res.json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, seller: req.user.id },
      { status: "inactive" },
      { new: true },
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.json({
      success: true,
      message: "Sản phẩm đã vô hiệu",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, update, remove };
