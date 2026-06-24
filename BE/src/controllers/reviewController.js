const { Review, OrderedItem, Product } = require("../models");

// [GET] /api/products/:productId/reviews
// Lấy danh sách reviews của sản phẩm
// Query: ?rating=5&page=1&limit=10
const getByProduct = async (req, res, next) => {
  try {
    // TODO: Review.find({ product: req.params.productId })
    //       .populate("customer", "name")
    //       .sort("-createdAt"), có pagination
  } catch (err) { next(err); }
};

// [POST] /api/products/:productId/reviews
// Tạo review. Chỉ customer đã mua (có OrderedItem đã delivered) mới được review
// Body: { ordered_item_id, rating, comment, img_urls }
const create = async (req, res, next) => {
  try {
    // TODO: kiểm tra OrderedItem tồn tại, thuộc về customer, và order đã delivered
    // TODO: Review.create({ product, customer, ordered_item, rating, comment, img_urls })
    // TODO: cập nhật avg_rating của Product:
    //         tính lại average bằng aggregate hoặc lấy avg từ Review.aggregate
    //         Product.findByIdAndUpdate({ avg_rating: newAvg })
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ success: false, message: "You already reviewed this product" });
    next(err);
  }
};

// [PUT] /api/reviews/:id
// Sửa review. Chỉ chủ review được sửa
// Body: { rating?, comment?, img_urls? }
const update = async (req, res, next) => {
  try {
    // TODO: findOne({ _id: req.params.id, customer: req.user.id })
    // TODO: cập nhật các field, save()
    // TODO: tính lại avg_rating của product
  } catch (err) { next(err); }
};

// [DELETE] /api/reviews/:id
// Xóa review. Chủ review hoặc admin
const remove = async (req, res, next) => {
  try {
    // TODO: nếu admin → findByIdAndDelete
    // TODO: nếu customer → findOneAndDelete({ _id, customer: req.user.id })
    // TODO: tính lại avg_rating của product
  } catch (err) { next(err); }
};

module.exports = { getByProduct, create, update, remove };
