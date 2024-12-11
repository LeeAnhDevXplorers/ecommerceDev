import mongoose from 'mongoose';

const productReviewsSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    review: {
      type: String,
      required: true,
      default: '',
    },
    customerRating: {
      type: String,
      required: true,
      default: 1,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt automatically

productReviewsSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

productReviewsSchema.set('toJSON', {
  virtuals: true,
});

export const ProductReviews = mongoose.model(
  'ProductReviews',
  productReviewsSchema
);
