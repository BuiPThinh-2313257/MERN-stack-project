const mongoose = require('mongoose');
const { Schema } = mongoose;

const voucherSchema = new Schema(
  {
    code:                { type: String, required: true, unique: true, uppercase: true, trim: true },
    type:                { type: String, enum: ['percentage', 'fixed'], required: true },
    start_date:          { type: Date, required: true },
    end_date:            { type: Date, required: true },
    min_order_value:     { type: Number, default: 0, min: 0 },
    discount_amount:     { type: Number, required: true, min: 0 },
    // Giới hạn số tiền giảm tối đa khi type = 'percentage' (bỏ qua nếu type = 'fixed')
    max_discount:        { type: Number, default: null },
    quantity:            { type: Number, required: true, min: 0 },
    used_quantity:       { type: Number, default: 0, min: 0 },
    status:              { type: String, enum: ['active', 'expired', 'disabled'], default: 'active' },
    seller:              { type: Schema.Types.ObjectId, ref: 'User', required: true },
    applicable_products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Voucher', voucherSchema);
