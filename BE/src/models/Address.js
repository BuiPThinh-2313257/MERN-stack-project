const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema = new Schema(
  {
    customer:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient_name:  { type: String, required: true, trim: true },
    recipient_phone: { type: String, required: true, trim: true },
    province_city:   { type: String, required: true, trim: true },
    district:        { type: String, required: true, trim: true },
    ward_commune:    { type: String, required: true, trim: true },
    description:     { type: String, trim: true },
    is_default:      { type: Boolean, default: false },
  },
  { timestamps: true }
);

addressSchema.index({ customer: 1 });

module.exports = mongoose.model('Address', addressSchema);
