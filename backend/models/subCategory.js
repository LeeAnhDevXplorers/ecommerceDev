import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    subCat: {
      type: String,
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt automatically

subCategorySchema.index({ category: 1, subCat: 1 }, { unique: true });

subCategorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

subCategorySchema.set('toJSON', {
  virtuals: true,
});

export const SubCategory = mongoose.model('SubCategory', subCategorySchema);
