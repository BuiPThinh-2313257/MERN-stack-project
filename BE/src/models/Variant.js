const mongoose = require('mongoose');
const { Schema } = mongoose;

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'FREESIZE'];

const variantSchema = new Schema(
  {
    sku:      { type: String, unique: true, sparse: true, trim: true },
    name:     { type: String, required: true, trim: true },
    img_urls: [{ type: String, trim: true }],
    price:    { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    stock:    { type: Number, required: true, min: 0 },
    color:    { type: String, trim: true },
    size:     { type: String, enum: CLOTHING_SIZES },
    product:  { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  },
  { timestamps: true }
);

variantSchema.index({ product: 1 });

module.exports = mongoose.model('Variant', variantSchema);
