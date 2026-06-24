const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('./User');

const sellerSchema = new Schema({
  shop_name:   { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  avatar_url:  { type: String, trim: true },
  tax:         { type: String, trim: true },
  is_verified: { type: Boolean, default: false },
});

const Seller = User.discriminator('seller', sellerSchema);

module.exports = Seller;
