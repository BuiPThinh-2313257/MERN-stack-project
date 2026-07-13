const { Shipping, Order } = require("../models");

const create = async (req, res, next) => {
  try {
    const { order_id, carrier, price, estimated_delivery_date } = req.body;
    const order = await Order.findOne({
      _id: order_id,
      status: "confirmed",
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    const shipping = await Shipping.create({
      order: order._id,
      price,
      carrier,
      ship_date: new Date(),
      estimated_delivery_date,
    });

    order.status = "shipping";
    await order.save();

    res.status(201).json({
      success: true,
      data: shipping,
    });
  } catch (err) {
    next(err);
  }
};

const getByOrder = async (req, res, next) => {
  try {
    const shipping = await Shipping.findOne({
      order: req.params.orderId,
    }).populate("order");

    if (!shipping) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin vận chuyển",
      });
    }

    if (
      req.user.role_type == "customer" &&
      shipping.order.customer.toString() !== req.user.id
    ) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.json({
      success: true,
      data: shipping,
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { track_number, status, ship_date, estimated_delivery_date } =
      req.body;
    const shipping = await Shipping.findOne({ _id: req.params.id }).populate(
      "order",
      "status",
    );
    if (!shipping) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin vận chuyển",
      });
    }

    if (track_number) {
      shipping.track_number = track_number;
    }

    if (ship_date) {
      shipping.ship_date = ship_date;
    }

    if (estimated_delivery_date) {
      shipping.estimated_delivery_date = estimated_delivery_date;
    }

    if (status) {
      shipping.status = status;
    }
    if (status === "delivered") {
      shipping.order.status = "delivered";
      await shipping.order.save();
    } else if (status === "failed") {
      shipping.order.status = "returned";
      await shipping.order.save();
    }

    await shipping.save();

    res.json({
      success: true,
      data: shipping,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getByOrder, update };
