import mongoose from 'mongoose';

const homeBannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true, // Each image URL must be a string
    },
  },
  { timestamps: true }
);

homeBannerSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

homeBannerSchema.set('toJSON', {
  virtuals: true,
});

export const HomeBanner = mongoose.model('HomeBanner', homeBannerSchema);
