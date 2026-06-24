const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartItemSchema = new Schema(
  {
    cart:        { type: Schema.Types.ObjectId, ref: 'Cart', required: true },
    variant:     { type: Schema.Types.ObjectId, ref: 'Variant', required: true },
    amount:      { type: Number, required: true, min: 1 },
    is_selected: { type: Boolean, default: false },
  },
  { timestamps: true }
);

cartItemSchema.index({ cart: 1, variant: 1 }, { unique: true });

module.exports = mongoose.model('CartItem', cartItemSchema);
