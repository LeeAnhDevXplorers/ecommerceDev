import mongoose from 'mongoose';
export const connectDB = async () => {
  await mongoose
    .connect(
      'mongodb+srv://workdev:0102030@cluster0.zadun.mongodb.net/ecommerce-app'
    )
    .then(() => console.log('DB Connected'));
};
