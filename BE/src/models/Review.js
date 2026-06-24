const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    product:      { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    customer:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // Ref đến OrderedItem để đảm bảo chỉ người đã mua mới được review
    ordered_item: { type: Schema.Types.ObjectId, ref: 'OrderedItem', required: true },
    rating:       { type: Number, required: true, min: 1, max: 5 },
    comment:      { type: String, trim: true },
    img_urls:     [{ type: String, trim: true }],
  },
  { timestamps: true }
);

// Mỗi customer chỉ review một product một lần
reviewSchema.index({ customer: 1, product: 1 }, { unique: true });
reviewSchema.index({ product: 1, rating: 1 });

module.exports = mongoose.model('Review', reviewSchema);
