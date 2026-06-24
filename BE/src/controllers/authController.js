const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Customer, Seller } = require("../models");

const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role_type: user.role_type },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

const register = async (req, res, next) => {
  try {
    const { name, username, email, phone, password, role_type, shop_name, description } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    let user;

    if (role_type === "seller") {
      user = await Seller.create({ name, username, email, phone, password: hashedPassword, role_type, shop_name, description });
    } else {
      user = await Customer.create({ name, username, email, phone, password: hashedPassword, role_type: "customer" });
    }

    res.status(201).json({ success: true, token: generateToken(user), user: { id: user._id, name: user.name, email: user.email, role_type: user.role_type } });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ success: false, message: `${field} already exists` });
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { Customer, Seller, User } = require("../models");

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

    res.json({ success: true, token: generateToken(user), user: { id: user._id, name: user.name, email: user.email, role_type: user.role_type } });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const { User } = require("../models");
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };
