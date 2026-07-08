const { Cart, CartItem, Variant } = require("../models");

// [GET] /api/cart
// Lấy giỏ hàng của customer đang đăng nhập, kèm danh sách items
const getMyCart = async (req, res, next) => {
  try {
    // TODO: Cart.findOne({ customer: req.user.id })
    // TODO: CartItem.find({ cart: cart._id })
    //       .populate("variant", "name price discount stock img_urls")
    //       populate thêm product qua variant nếu cần
    const cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          items: [],
        },
      });
    }

    const cartItems = await CartItem.find({ cart: cart._id }).populate({
      path: "variant",
      select: "name price discount stock img_urls product",
      populate: {
        path: "product",
        select: "name",
      },
    });
    res.status(200).json({
      success: true,
      data: {
        items: cartItems,
      },
    });
  } catch (err) {
    next(err);
  }
};

// [POST] /api/cart/items
// Thêm sản phẩm vào giỏ. Nếu item (cart + variant) đã tồn tại thì cộng thêm amount
// Body: { variant_id, amount }
const addItem = async (req, res, next) => {
  try {
    // TODO: tìm hoặc tạo Cart cho customer (findOneAndUpdate với upsert:true)
    // TODO: kiểm tra Variant có tồn tại và còn hàng không
    // TODO: CartItem.findOneAndUpdate(
    //         { cart, variant },
    //         { $inc: { amount: req.body.amount } },
    //         { upsert: true, new: true }
    //       )
    const cart = await Cart.findOneAndUpdate(
      { customer: req.user.id },
      {},
      { upsert: true, new: true },
    );

    const variant = await Variant.findById(req.body.variant_id);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    } else if (variant.stock < req.body.amount) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock",
      });
    }

    const cartItem = await CartItem.findOneAndUpdate(
      { cart: cart._id, variant: req.body.variant_id },
      { $inc: { amount: req.body.amount } },
      { upsert: true, new: true },
    );

    res.status(201).json({
      success: true,
      data: cartItem,
    });
  } catch (err) {
    next(err);
  }
};

// [PUT] /api/cart/items/:itemId
// Cập nhật số lượng hoặc is_selected của CartItem
// Body: { amount?, is_selected? }
const updateItem = async (req, res, next) => {
  try {
    // TODO: tìm cart của user, rồi findOneAndUpdate CartItem
    //       đảm bảo CartItem.cart === cart._id (tránh sửa giỏ người khác)
    // TODO: nếu amount < 1 thì xóa item luôn
    const { cart: _cart, variant: _variant, ...safeData } = req.body;
    const cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    if (req.body.amount && req.body.amount < 1) {
      const deletedItem = await CartItem.findOneAndDelete({
        _id: req.params.itemId,
        cart: cart._id,
      });

      return res.status(200).json({
        success: true,
        data: deletedItem,
      });
    }

    const updatedItem = await CartItem.findOneAndUpdate(
      { _id: req.params.itemId, cart: cart._id },
      safeData,
      { new: true },
    );

    res.status(200).json({
      success: true,
      data: updatedItem,
    });
  } catch (err) {
    next(err);
  }
};

// [DELETE] /api/cart/items/:itemId
// Xóa một CartItem khỏi giỏ
const removeItem = async (req, res, next) => {
  try {
    // TODO: tìm cart của user
    // TODO: CartItem.findOneAndDelete({ _id: req.params.itemId, cart: cart._id })
    const cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const deletedItem = await CartItem.findOneAndDelete({
      _id: req.params.itemId,
      cart: cart._id,
    });

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: " CartItem not found",
      });
    }
    res.status(200).json({
      success: true,
      data: deletedItem,
    });
  } catch (err) {
    next(err);
  }
};
// [DELETE] /api/cart
// Xóa toàn bộ giỏ hàng (dùng sau khi đặt hàng thành công)
const clearCart = async (req, res, next) => {
  try {
    // TODO: tìm cart của user
    // TODO: CartItem.deleteMany({ cart: cart._id })
    const cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const deletedItems = await CartItem.deleteMany({ cart: cart._id });

    res.status(200).json({
      success: true,
      data: deletedItems,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMyCart, addItem, updateItem, removeItem, clearCart };
