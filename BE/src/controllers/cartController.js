const { Cart, CartItem, Variant } = require("../models");

const getMyCart = async (req, res, next) => {
  try {
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

const addItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { customer: req.user.id },
      {},
      { upsert: true, new: true },
    );

    const variant = await Variant.findById(req.body.variant_id);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    } else if (variant.stock < req.body.amount) {
      return res.status(400).json({
        success: false,
        message: "Hết hàng",
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

const updateItem = async (req, res, next) => {
  try {
    const { cart: _cart, variant: _variant, ...safeData } = req.body;
    const cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
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

const removeItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    const deletedItem = await CartItem.findOneAndDelete({
      _id: req.params.itemId,
      cart: cart._id,
    });

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: " Không tìm thấy sản phẩm",
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
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
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
