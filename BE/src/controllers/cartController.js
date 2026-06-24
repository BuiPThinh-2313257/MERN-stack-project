const { Cart, CartItem, Variant } = require("../models");

// [GET] /api/cart
// Lấy giỏ hàng của customer đang đăng nhập, kèm danh sách items
const getMyCart = async (req, res, next) => {
  try {
    // TODO: Cart.findOne({ customer: req.user.id })
    // TODO: CartItem.find({ cart: cart._id })
    //       .populate("variant", "name price discount stock img_urls")
    //       populate thêm product qua variant nếu cần
  } catch (err) { next(err); }
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
  } catch (err) { next(err); }
};

// [PUT] /api/cart/items/:itemId
// Cập nhật số lượng hoặc is_selected của CartItem
// Body: { amount?, is_selected? }
const updateItem = async (req, res, next) => {
  try {
    // TODO: tìm cart của user, rồi findOneAndUpdate CartItem
    //       đảm bảo CartItem.cart === cart._id (tránh sửa giỏ người khác)
    // TODO: nếu amount < 1 thì xóa item luôn
  } catch (err) { next(err); }
};

// [DELETE] /api/cart/items/:itemId
// Xóa một CartItem khỏi giỏ
const removeItem = async (req, res, next) => {
  try {
    // TODO: tìm cart của user
    // TODO: CartItem.findOneAndDelete({ _id: req.params.itemId, cart: cart._id })
  } catch (err) { next(err); }
};

// [DELETE] /api/cart
// Xóa toàn bộ giỏ hàng (dùng sau khi đặt hàng thành công)
const clearCart = async (req, res, next) => {
  try {
    // TODO: tìm cart của user
    // TODO: CartItem.deleteMany({ cart: cart._id })
  } catch (err) { next(err); }
};

module.exports = { getMyCart, addItem, updateItem, removeItem, clearCart };
