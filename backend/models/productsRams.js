import mongoose from 'mongoose';

const productRamsSchema = mongoose.Schema(
  {
    ramName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

productRamsSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

productRamsSchema.set('toJSON', {
  virtuals: true,
});

export const ProductRams = mongoose.model('ProductRams', productRamsSchema);
