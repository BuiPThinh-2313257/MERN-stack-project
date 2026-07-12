const {
  Order,
  OrderedItem,
  Cart,
  CartItem,
  Variant,
  Voucher,
  Product,
} = require("../models");

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

    const cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Chưa có sản phầm nào trong giỏ hàng",
      });
    }
    const cartItems = await CartItem.find({
      cart: cart._id,
      is_selected: true,
    }).populate("variant");

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không có sản phầm trong giỏ hàng",
      });
    }

    for (const item of cartItems) {
      if (item.amount > item.variant.stock) {
        return res.status(400).json({
          success: false,
          message: "Không đủ số lượng" + item.variant._id,
        });
      }
    }

    const itemsTotal = cartItems.reduce((total, item) => {
      return (
        total +
        item.variant.price * (1 - item.variant.discount / 100) * item.amount
      );
    }, 0);

    let voucher = null;
    let voucher_discount = 0;

    //Validate voucher
    if (req.body.voucher_code) {
      voucher = await Voucher.findOne({ code: req.body.voucher_code });

      if (!voucher) {
        return res.status(400).json({
          success: false,
          message: "Mã không hợp lệ",
        });
      }

      if (voucher.status !== "active") {
        return res.status(400).json({
          success: false,
          message: "Voucher không khả dụng",
        });
      }

      if (voucher.start_date > new Date()) {
        return res.status(400).json({
          success: false,
          message: "Voucher chưa bắt đầu",
        });
      }

      if (voucher.end_date < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Voucher đã hết hạn",
        });
      }

      if (voucher.used_quantity >= voucher.quantity) {
        return res.status(400).json({
          success: false,
          message: "Đã hết voucher",
        });
      }

      if (voucher.min_order_value > itemsTotal) {
        return res.status(400).json({
          success: false,
          message: "Đơn hàng không đủ yêu cầu",
        });
      }

      if (voucher.type === "fixed") {
        voucher_discount = voucher.discount_amount;
      } else {
        voucher_discount = (itemsTotal * voucher.discount_amount) / 100;
        if (
          voucher.max_discount !== null &&
          voucher.max_discount < voucher_discount
        ) {
          voucher_discount = voucher.max_discount;
        }
      }
    }
    const total_amount = itemsTotal - voucher_discount;

    const order = await Order.create({
      customer: req.user.id,
      payment_method: req.body.payment_method,
      voucher: voucher ? voucher._id : null,
      voucher_discount: voucher_discount,
      address: req.body.address_id,
      total_amount: total_amount,
    });

    const orderedItems = cartItems.map((item) => ({
      order: order._id,
      variant: item.variant._id,
      variant_name: item.variant.name,
      quantity: item.amount,
      unit_price: item.variant.price,
      unit_discount: item.variant.discount,
    }));

    await OrderedItem.insertMany(orderedItems);

    await Promise.all([
      ...cartItems.map((item) =>
        Variant.findByIdAndUpdate(item.variant._id, {
          $inc: { stock: -item.amount },
        }),
      ),
      ...cartItems.map((item) =>
        Product.findByIdAndUpdate(item.variant.product, {
          $inc: { sold_amount: item.amount },
        }),
      ),
      voucher &&
        Voucher.findByIdAndUpdate(voucher._id, { $inc: { used_quantity: 1 } }),
    ]);

    // Xóa các CartItem đã đặt
    await CartItem.deleteMany({ cart: cart._id, is_selected: true });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

// [GET] /api/orders
// Customer: lấy đơn hàng của mình | Seller: lấy đơn hàng có sản phẩm của shop
// Query: ?status=pending&page=1&limit=10
const getOrders = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role_type === "customer") {
      filter.customer = req.user.id;
    } else if (req.user.role_type === "seller") {
      const productIds = await Product.distinct("_id", { seller: req.user.id });
      const variantIds = await Variant.distinct("_id", {
        product: { $in: productIds },
      });
      const orderIds = await OrderedItem.distinct("order", {
        variant: { $in: variantIds },
      });
      filter._id = { $in: orderIds };
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("customer", "name email")
        .populate("address")
        .sort("-createdAt")
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// [GET] /api/orders/:id
// Lấy chi tiết một đơn hàng kèm ordered items
const getOne = async (req, res, next) => {
  try {
    // TODO: Order.findById(req.params.id).populate(...)
    // TODO: kiểm tra quyền: customer chỉ xem đơn của mình
    // TODO: OrderedItem.find({ order: id }).populate("variant")
    const order = await Order.findById(req.params.id)
      .populate("address")
      .populate("voucher");

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    const orderedItems = await OrderedItem.find({ order: order._id }).populate({
      path: "variant",
      select: "product",
      populate: { path: "product", select: "seller" },
    });

    if (req.user.role_type == "customer") {
      if (order.customer.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }
    } else if (req.user.role_type == "seller") {
      const isOwner = orderedItems.some(
        (item) => item.variant.product.seller.toString() === req.user.id,
      );

      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: "Không tồn tại đơn hàng",
        });
      }
    }

    res.status(200).json({
      success: true,
      data: { order, items: orderedItems },
    });
  } catch (err) {
    next(err);
  }
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

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    const orderedItems = await OrderedItem.find({ order: order._id }).populate({
      path: "variant",
      select: "product",
      populate: { path: "product", select: "seller" },
    });

    const ALLOWED_BY_ROLE = {
      customer: ["cancelled"],
      seller: ["confirmed", "shipping", "delivered"],
      admin: ["confirmed", "shipping", "delivered", "cancelled"],
    };

    const VALID_TRANSITIONS = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["shipping", "cancelled"],
      shipping: ["delivered", "cancelled"],
      delivered: [],
      cancelled: [],
    };

    if (req.user.role_type == "customer") {
      if (order.customer.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }
    } else if (req.user.role_type == "seller") {
      const isOwner = orderedItems.some(
        (item) => item.variant.product.seller.toString() === req.user.id,
      );

      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: "Không tồn tại đơn hàng",
        });
      }
    }

    const { status } = req.body;
    if (!ALLOWED_BY_ROLE[req.user.role_type]?.includes(status)) {
      return res.status(403).json({
        success: false,
        message: "Không thể thực hiện hành động này",
      });
    }

    if (!VALID_TRANSITIONS[order.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `không thể chuyển từ ${order.status} sang ${status}`,
      });
    }

    if (status === "cancelled") {
      await Promise.all(
        orderedItems.map((item) =>
          Variant.findByIdAndUpdate(item.variant._id, {
            $inc: { stock: item.quantity },
          }),
        ),
      );
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, getOrders, getOne, updateStatus };
