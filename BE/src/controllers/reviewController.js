const mongoose = require("mongoose");
const { Review, OrderedItem, Product } = require("../models");

const recalcAvgRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: "$product", avg: { $avg: "$rating" } } },
  ]);

  const newAvg = stats.length ? stats[0].avg : 0;
  await Product.findByIdAndUpdate(productId, { avg_rating: newAvg });
};

const getByProduct = async (req, res, next) => {
  try {
    const filter = { product: req.params.productId };
    const { rating, page = 1, limit = 10 } = req.query;
    if (rating) {
      filter.rating = Number(rating);
    }
    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate("customer", "name")
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: reviews,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { ordered_item_id, rating, comment, img_urls } = req.body;
    const item = await OrderedItem.findById(ordered_item_id)
      .populate("order", "customer status ")
      .populate("variant", "product");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Không thể đánh giá sản phẩm chưa mua",
      });
    }

    if (item.order.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Không thể đánh giá sản phẩm chưa mua",
      });
    }

    if (item.order.status !== "delivered") {
      return res.status(400).json({
        success: false,
        message: "Không thể đánh giá sản phẩm chưa được giao",
      });
    }

    if (item.variant.product.toString() !== req.params.productId) {
      return res.status(400).json({
        success: false,
        message: "Không thể đánh giá sản phẩm chưa mua",
      });
    }

    const review = await Review.create({
      product: req.params.productId,
      customer: req.user.id,
      ordered_item: ordered_item_id,
      rating,
      img_urls: img_urls,
      comment: comment,
    });

    await recalcAvgRating(review.product);

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (err) {
    if (err.code === 11000)
      return res
        .status(400)
        .json({ success: false, message: "Bạn đã đánh giá sản phẩm này" });
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { rating, comment, img_urls } = req.body;
    const review = await Review.findOne({
      _id: req.params.id,
      customer: req.user.id,
    });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Không tồn tại đánh giá",
      });
    }

    if (rating) {
      review.rating = rating;
    }
    if (comment) {
      review.comment = comment;
    }
    if (img_urls) {
      review.img_urls = img_urls;
    }
    await review.save();

    await recalcAvgRating(review.product);

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    let review;
    if (req.user.role_type === "admin") {
      review = await Review.findByIdAndDelete(req.params.id);
    } else {
      review = await Review.findOneAndDelete({
        _id: req.params.id,
        customer: req.user.id,
      });
    }

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Không tồn tại đánh giá",
      });
    }

    await recalcAvgRating(review.product);

    res.status(200).json({
      success: true,
      message: "Đã xóa đánh giá",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getByProduct, create, update, remove };
