const { Voucher } = require("../models");

const getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role_type === "seller") {
      filter.seller = req.user.id;
    }

    const vouchers = await Voucher.find(filter).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: vouchers.length,
      data: vouchers,
    });
  } catch (err) {
    next(err);
  }
};

const validate = async (req, res, next) => {
  try {
    const { code, order_total } = req.body;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Thiếu mã voucher",
      });
    }

    const voucher = await Voucher.findOne({
      code: code.toUpperCase(),
      status: "active",
    });
    if (!voucher) {
      return res.status(400).json({
        success: false,
        message: "Mã không hợp lệ",
      });
    }

    const now = new Date();
    if (voucher.start_date > now) {
      return res.status(400).json({
        success: false,
        message: "Voucher chưa bắt đầu",
      });
    }

    if (voucher.end_date < now) {
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

    if (voucher.min_order_value > order_total) {
      return res.status(400).json({
        success: false,
        message: "Đơn hàng chưa đạt giá trị tối thiểu",
      });
    }

    let discount;
    if (voucher.type === "fixed") {
      discount = voucher.discount_amount;
    } else {
      discount = (order_total * voucher.discount_amount) / 100;
      if (voucher.max_discount !== null && voucher.max_discount < discount) {
        discount = voucher.max_discount;
      }
    }

    res.status(200).json({
      success: true,
      data: { valid: true, discount, voucher_id: voucher._id },
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const voucher = await Voucher.create({
      ...req.body,
      seller: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: voucher,
    });
  } catch (err) {
    if (err.code === 11000)
      return res
        .status(400)
        .json({ success: false, message: "Mã giảm giá đã tồn tại" });
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { seller, used_quantity, ...updateData } = req.body;
    const voucher = await Voucher.findOneAndUpdate(
      { _id: req.params.id, seller: req.user.id },
      updateData,
      { new: true, runValidators: true },
    );

    if (!voucher) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy Voucher",
      });
    }

    res.status(200).json({
      success: true,
      data: voucher,
    });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const voucher = await Voucher.findOneAndUpdate(
      { _id: req.params.id, seller: req.user.id },
      { status: "disabled" },
      { new: true },
    );

    if (!voucher) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy Voucher",
      });
    }

    res.status(200).json({
      success: true,
      message: "Voucher đã vô hiểu",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, validate, create, update, remove };
