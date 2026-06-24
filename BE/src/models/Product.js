const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    product_name:     { type: String, required: true, trim: true },
    description:      { type: String, trim: true },
    tags:             [{ type: String, trim: true }],
    status:           { type: String, enum: ['active', 'inactive', 'banned'], default: 'active' },
    img_urls:         [{ type: String, trim: true }],
    display_price:    { type: Number, required: true, min: 0 },
    display_discount: { type: Number, default: 0, min: 0, max: 100 },
    avg_rating:       { type: Number, default: 0, min: 0, max: 5 },
    sold_amount:      { type: Number, default: 0, min: 0 },
    seller:           { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sub_category:     { type: Schema.Types.ObjectId, ref: 'SubCategory', required: true },
  },
  { timestamps: true }
);

productSchema.index({ seller: 1 });
productSchema.index({ sub_category: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ product_name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
