const { Payment, Order } = require("../models");

// [POST] /api/payments
// Tạo bản ghi thanh toán sau khi đặt hàng
// Body: { order_id, method, amount, transaction_id? }
const create = async (req, res, next) => {
  try {
    // TODO: kiểm tra Order tồn tại và thuộc về req.user.id
    // TODO: Payment.create({ customer: req.user.id, order, method, amount })
    // TODO: cập nhật Order.payment = payment._id
    const { order_id, method, transaction_id } = req.body;

    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không có đơn hàng",
      });
    }

    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Người dùng không có quyền thanh toán",
      });
    }

    if (order.payment) {
      return res.status(400).json({
        success: false,
        message: "Đã thanh toán",
      });
    }

    const payment = await Payment.create({
      customer: req.user.id,
      order: order_id,
      method,
      amount: order.total_amount,
      transaction_id,
    });

    order.payment = payment._id;
    await order.save();

    res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (err) {
    next(err);
  }
};

// [GET] /api/payments/:orderId
// Lấy thông tin thanh toán của một đơn hàng
const getByOrder = async (req, res, next) => {
  try {
    // TODO: Payment.findOne({ order: req.params.orderId })
    // TODO: kiểm tra quyền: chỉ customer của đơn hàng đó mới xem được
    const payment = await Payment.findOne({ order: req.params.orderId });
    if (!payment) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy hóa đơn",
      });
    }

    if (
      payment.customer.toString() !== req.user.id &&
      req.user.role_type === "customer"
    ) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (err) {
    next(err);
  }
};

// [PUT] /api/payments/:id/status
// Admin cập nhật trạng thái thanh toán (paid / failed / refunded)
// Body: { status, transaction_id? }
const updateStatus = async (req, res, next) => {
  try {
    // TODO: Payment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    // TODO: nếu status = "paid" → cân nhắc update Order.status = "confirmed"
    const { status, transaction_id } = req.body;
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy hóa đơn",
      });
    }

    const VALID_STATUS = ["pending", "paid", "failed", "refunded"];
    if (!VALID_STATUS.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không phù hợp",
      });
    }

    payment.status = status;
    if (transaction_id) {
      payment.transaction_id = transaction_id;
    }

    await payment.save();

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getByOrder, updateStatus };
