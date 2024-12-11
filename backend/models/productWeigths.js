import mongoose from 'mongoose';

const productWeigthSchema = new mongoose.Schema(
  {
    weightName: {
      type: String,
      required: [true, 'Tên trọng lượng là bắt buộc'],
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true, 
  }
);

productWeigthSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

productWeigthSchema.set('toJSON', {
  virtuals: true,
});

export const ProductWeigth = mongoose.model(
  'ProductWeigth',
  productWeigthSchema
);
