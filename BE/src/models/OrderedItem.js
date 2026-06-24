const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderedItemSchema = new Schema(
  {
    order:         { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    variant:       { type: Schema.Types.ObjectId, ref: 'Variant', required: true },
    variant_name:  { type: String, required: true, trim: true },
    quantity:      { type: Number, required: true, min: 1 },
    unit_price:    { type: Number, required: true, min: 0 },
    unit_discount: { type: Number, default: 0, min: 0, max: 100 },
    is_returned:   { type: Boolean, default: false },
    reason:        { type: String, trim: true },
  },
  { timestamps: true }
);

orderedItemSchema.index({ order: 1 });

module.exports = mongoose.model('OrderedItem', orderedItemSchema);
