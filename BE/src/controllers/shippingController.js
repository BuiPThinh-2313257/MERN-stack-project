const { Shipping, Order } = require("../models");

// [POST] /api/shipping
// Seller/Admin tạo thông tin vận chuyển cho đơn hàng
// Body: { order_id, carrier, price, estimated_delivery_date }
const create = async (req, res, next) => {
  try {
    // TODO: kiểm tra Order tồn tại và đang ở trạng thái "confirmed"
    // TODO: Shipping.create({ order, carrier, price, estimated_delivery_date })
    // TODO: cập nhật Order.status = "shipping"
  } catch (err) { next(err); }
};

// [GET] /api/shipping/:orderId
// Lấy thông tin vận chuyển của một đơn hàng
const getByOrder = async (req, res, next) => {
  try {
    // TODO: Shipping.findOne({ order: req.params.orderId }).populate("order")
  } catch (err) { next(err); }
};

// [PUT] /api/shipping/:id
// Seller/Admin cập nhật thông tin vận chuyển (track_number, status, ship_date...)
// Body: { track_number?, status?, ship_date?, estimated_delivery_date? }
const update = async (req, res, next) => {
  try {
    // TODO: Shipping.findByIdAndUpdate(req.params.id, req.body, { new: true })
    // TODO: nếu status = "delivered" → cập nhật Order.status = "delivered"
    // TODO: nếu status = "failed" → cân nhắc thông báo seller/customer
  } catch (err) { next(err); }
};

module.exports = { create, getByOrder, update };
