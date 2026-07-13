const { Address } = require("../models");

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

const create = async (req, res, next) => {
  try {
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

const update = async (req, res, next) => {
  try {
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
        message: "Không tìm thấy địa chỉ",
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

const remove = async (req, res, next) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      customer: req.user.id,
    });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy địa chỉ",
      });
    }
    res.status(200).json({
      success: true,
      message: "Địa chỉ đã được xóa",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMyAddresses, create, update, remove };
