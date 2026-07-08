const { Address } = require("../models");

// [GET] /api/addresses
// Lấy tất cả địa chỉ của customer đang đăng nhập
const getMyAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ customer: req.user.id }).sort({
      is_default: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: addresses.length,
      data: addresses,
    });
  } catch (err) {
    next(err);
  }
};

// [POST] /api/addresses
// Tạo địa chỉ mới. Nếu is_default = true thì reset tất cả địa chỉ khác về false trước
const create = async (req, res, next) => {
  try {
    // TODO: nếu req.body.is_default → updateMany({ customer: req.user.id }, { is_default: false })
    // TODO: Address.create({ ...req.body, customer: req.user.id })
    if (req.body.is_default) {
      await Address.updateMany(
        { customer: req.user.id },
        { is_default: false },
      );
    }
    const address = await Address.create({
      ...req.body,
      customer: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: address,
    });
  } catch (err) {
    next(err);
  }
};

// [PUT] /api/addresses/:id
// Cập nhật địa chỉ. Chỉ được sửa địa chỉ của chính mình
const update = async (req, res, next) => {
  try {
    // TODO: nếu req.body.is_default → reset is_default trước
    // TODO: findOneAndUpdate({ _id: req.params.id, customer: req.user.id }, req.body, { new: true })
    // TODO: 404 nếu không tìm thấy
    if (req.body.is_default) {
      await Address.updateMany(
        { customer: req.user.id },
        { is_default: false },
      );
    }
    const { customer, ...updData } = req.body;
    const address = await Address.findOneAndUpdate(
      {
        _id: req.params.id,
        customer: req.user.id,
      },
      updData,
      { new: true },
    );
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }
    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (err) {
    next(err);
  }
};

// [DELETE] /api/addresses/:id
// Xóa địa chỉ. Chỉ được xóa địa chỉ của chính mình
const remove = async (req, res, next) => {
  try {
    // TODO: findOneAndDelete({ _id: req.params.id, customer: req.user.id })
    // TODO: 404 nếu không tìm thấy
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      customer: req.user.id,
    });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Address deleted",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMyAddresses, create, update, remove };
