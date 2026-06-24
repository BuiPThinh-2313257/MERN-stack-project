const { Voucher } = require("../models");

// [GET] /api/vouchers
// Seller: lấy vouchers của shop mình | Admin: lấy tất cả
const getAll = async (req, res, next) => {
  try {
    // TODO: nếu role = seller → filter { seller: req.user.id }
    // TODO: Voucher.find(filter).sort("-createdAt")
  } catch (err) { next(err); }
};

// [POST] /api/vouchers/validate
// Kiểm tra voucher có hợp lệ không trước khi checkout
// Body: { code, order_total }
const validate = async (req, res, next) => {
  try {
    // TODO: Voucher.findOne({ code: req.body.code.toUpperCase(), status: "active" })
    // TODO: kiểm tra: còn hạn (start_date <= now <= end_date)
    // TODO: còn lượt sử dụng (used_quantity < quantity)
    // TODO: giá trị đơn hàng >= min_order_value
    // TODO: tính discount_amount thực tế:
    //         type = "fixed" → discount_amount
    //         type = "percentage" → order_total * discount_amount/100, tối đa max_discount
    // TODO: trả về { valid: true, discount }
  } catch (err) { next(err); }
};

// [POST] /api/vouchers
// Seller tạo voucher mới
const create = async (req, res, next) => {
  try {
    // TODO: Voucher.create({ ...req.body, seller: req.user.id })
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ success: false, message: "Voucher code already exists" });
    next(err);
  }
};

// [PUT] /api/vouchers/:id
// Seller cập nhật voucher của mình
const update = async (req, res, next) => {
  try {
    // TODO: findOneAndUpdate({ _id: req.params.id, seller: req.user.id }, req.body, { new: true })
  } catch (err) { next(err); }
};

// [DELETE] /api/vouchers/:id
// Seller vô hiệu hóa voucher (set status = "disabled")
const remove = async (req, res, next) => {
  try {
    // TODO: findOneAndUpdate({ _id: req.params.id, seller: req.user.id }, { status: "disabled" })
  } catch (err) { next(err); }
};

module.exports = { getAll, validate, create, update, remove };
