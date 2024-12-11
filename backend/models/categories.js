import mongoose from 'mongoose';

const categoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true, // Each image URL must be a string
      },
    ],
    color: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt automatically

categoriesSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

categoriesSchema.set('toJSON', {
  virtuals: true,
});

export const Category = mongoose.model('Category', categoriesSchema);
