const mongoose = require('mongoose');
const { Schema } = mongoose;

const shippingSchema = new Schema(
  {
    order:                   { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    carrier:                 { type: String, trim: true },
    ship_date:               { type: Date },
    estimated_delivery_date: { type: Date },
    price:                   { type: Number, required: true, min: 0 },
    track_number:            { type: String, trim: true },
    status: {
      type: String,
      enum: ['preparing', 'picked_up', 'in_transit', 'delivered', 'failed'],
      default: 'preparing',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shipping', shippingSchema);
