import mongoose from 'mongoose';

const productSizeSchema = new mongoose.Schema(
  {
    sizeName: {
      type: String, 
      required: [true, 'Tên kích thước là bắt buộc'],
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

productSizeSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

productSizeSchema.set('toJSON', {
  virtuals: true,
});

export const ProductSize = mongoose.model('ProductSize', productSizeSchema);
