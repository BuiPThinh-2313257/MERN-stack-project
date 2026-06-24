const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    customer:         { type: Schema.Types.ObjectId, ref: 'User', required: true },
    payment:          { type: Schema.Types.ObjectId, ref: 'Payment', default: null },
    payment_method:   { type: String, enum: ['cod', 'bank_transfer', 'e_wallet'], required: true },
    voucher:          { type: Schema.Types.ObjectId, ref: 'Voucher', default: null },
    voucher_discount: { type: Number, default: 0, min: 0 },
    address:          { type: Schema.Types.ObjectId, ref: 'Address', required: true },
    total_amount:     { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled', 'returned'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

orderSchema.index({ customer: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
