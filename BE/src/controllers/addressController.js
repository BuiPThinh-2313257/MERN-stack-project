const { Address } = require("../models");

// [GET] /api/addresses
// Lấy tất cả địa chỉ của customer đang đăng nhập
const getMyAddresses = async (req, res, next) => {
  try {
    // TODO: Address.find({ customer: req.user.id })
  } catch (err) { next(err); }
};

// [POST] /api/addresses
// Tạo địa chỉ mới. Nếu is_default = true thì reset tất cả địa chỉ khác về false trước
const create = async (req, res, next) => {
  try {
    // TODO: nếu req.body.is_default → updateMany({ customer: req.user.id }, { is_default: false })
    // TODO: Address.create({ ...req.body, customer: req.user.id })
  } catch (err) { next(err); }
};

// [PUT] /api/addresses/:id
// Cập nhật địa chỉ. Chỉ được sửa địa chỉ của chính mình
const update = async (req, res, next) => {
  try {
    // TODO: nếu req.body.is_default → reset is_default trước
    // TODO: findOneAndUpdate({ _id: req.params.id, customer: req.user.id }, req.body, { new: true })
    // TODO: 404 nếu không tìm thấy
  } catch (err) { next(err); }
};

// [DELETE] /api/addresses/:id
// Xóa địa chỉ. Chỉ được xóa địa chỉ của chính mình
const remove = async (req, res, next) => {
  try {
    // TODO: findOneAndDelete({ _id: req.params.id, customer: req.user.id })
    // TODO: 404 nếu không tìm thấy
  } catch (err) { next(err); }
};

module.exports = { getMyAddresses, create, update, remove };
