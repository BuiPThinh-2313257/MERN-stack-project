const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    password: { type: String, required: true },
    role_type: {
      type: String,
      enum: ["customer", "seller", "admin"],
      required: true,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "role_type",
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
