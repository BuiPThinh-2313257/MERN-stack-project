const { Order, OrderedItem, CartItem, Variant, Voucher } = require("../models");

// [POST] /api/orders
// Tạo đơn hàng từ các CartItem được chọn (is_selected = true)
// Body: { payment_method, address_id, voucher_code? }
const createOrder = async (req, res, next) => {
  try {
    // TODO: lấy CartItems is_selected của customer, populate variant
    // TODO: kiểm tra stock từng variant đủ không
    // TODO: nếu có voucher_code → validate (còn hạn, còn lượt, min_order_value)
    // TODO: tính total_amount:
    //         item.unit_price * (1 - discount/100) * quantity, rồi trừ voucher
    // TODO: Order.create({ customer, payment_method, address, voucher, voucher_discount, total_amount })
    // TODO: OrderedItem.insertMany(items)
    // TODO: Cập nhật stock từng Variant ($inc: { stock: -quantity, sold_amount: +quantity })
    // TODO: Nếu voucher dùng → Voucher $inc used_quantity
    // TODO: Xóa CartItems đã chọn
  } catch (err) { next(err); }
};

// [GET] /api/orders
// Customer: lấy đơn hàng của mình | Seller: lấy đơn hàng có sản phẩm của shop
// Query: ?status=pending&page=1&limit=10
const getOrders = async (req, res, next) => {
  try {
    // TODO: nếu role = customer → filter { customer: req.user.id }
    // TODO: nếu role = seller → cần aggregate qua OrderedItem → Variant → Product.seller
    // TODO: pagination, sort theo -createdAt
    // TODO: populate customer, address, payment
  } catch (err) { next(err); }
};

// [GET] /api/orders/:id
// Lấy chi tiết một đơn hàng kèm ordered items
const getOne = async (req, res, next) => {
  try {
    // TODO: Order.findById(req.params.id).populate(...)
    // TODO: kiểm tra quyền: customer chỉ xem đơn của mình
    // TODO: OrderedItem.find({ order: id }).populate("variant")
  } catch (err) { next(err); }
};

// [PUT] /api/orders/:id/status
// Cập nhật trạng thái đơn hàng
// Body: { status }
// Luồng hợp lệ: pending→confirmed→shipping→delivered | pending/confirmed→cancelled
const updateStatus = async (req, res, next) => {
  try {
    // TODO: kiểm tra role và trạng thái hợp lệ
    //   - seller/admin: confirmed, shipping, delivered
    //   - customer: cancelled (chỉ khi đang pending)
    // TODO: nếu cancelled → hoàn lại stock ($inc: { stock: +quantity })
    // TODO: Order.findByIdAndUpdate({ status: req.body.status }, { new: true })
  } catch (err) { next(err); }
};

module.exports = { createOrder, getOrders, getOne, updateStatus };
