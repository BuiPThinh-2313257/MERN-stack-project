const { Payment, Order } = require("../models");

// [POST] /api/payments
// Tạo bản ghi thanh toán sau khi đặt hàng
// Body: { order_id, method, amount, transaction_id? }
const create = async (req, res, next) => {
  try {
    // TODO: kiểm tra Order tồn tại và thuộc về req.user.id
    // TODO: Payment.create({ customer: req.user.id, order, method, amount })
    // TODO: cập nhật Order.payment = payment._id
  } catch (err) { next(err); }
};

// [GET] /api/payments/:orderId
// Lấy thông tin thanh toán của một đơn hàng
const getByOrder = async (req, res, next) => {
  try {
    // TODO: Payment.findOne({ order: req.params.orderId })
    // TODO: kiểm tra quyền: chỉ customer của đơn hàng đó mới xem được
  } catch (err) { next(err); }
};

// [PUT] /api/payments/:id/status
// Admin cập nhật trạng thái thanh toán (paid / failed / refunded)
// Body: { status, transaction_id? }
const updateStatus = async (req, res, next) => {
  try {
    // TODO: Payment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    // TODO: nếu status = "paid" → cân nhắc update Order.status = "confirmed"
  } catch (err) { next(err); }
};

module.exports = { create, getByOrder, updateStatus };
