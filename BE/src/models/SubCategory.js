const mongoose = require('mongoose');
const { Schema } = mongoose;

const subCategorySchema = new Schema(
  {
    name:     { type: String, required: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  },
  { timestamps: true }
);

// Tên subcategory chỉ cần unique trong cùng một category
subCategorySchema.index({ name: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('SubCategory', subCategorySchema);
