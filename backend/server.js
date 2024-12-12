import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { connectDB } from './config/db.js';
import cartRouter from './controllersRouter/cart.js';
import categoryRouter from './controllersRouter/categories.js'; // Adjust the path as needed
import ordersRouter from './controllersRouter/orders.js';
import pRamRouter from './controllersRouter/productRams.js';
import pReviewRouter from './controllersRouter/productReviews.js';
import productRouter from './controllersRouter/products.js';
import psizeRouter from './controllersRouter/productSize.js';
import pWeightRouter from './controllersRouter/productWeigth.js';
import subCatRouter from './controllersRouter/subCategory.js';
import userRouter from './controllersRouter/users.js';
import searchRouter from './controllersRouter/search.js';
import authJwt from './helper/jwt.js';
const app = express();
app.use(express.json());

app.use(cors());
app.options('*', cors());
// app.use(authJwt());

// Router
app.use('/uploads', express.static('uploads'));
app.use('/api/category',  categoryRouter);
app.use('/api/subcategory', subCatRouter);
app.use('/api/products', authJwt(), productRouter);
app.use('/api/weight', pWeightRouter);
app.use('/api/prams', pRamRouter);
app.use('/api/psize', psizeRouter);
app.use('/api/user', userRouter);
app.use('/api/cart',  authJwt(),  cartRouter);
app.use('/api/orders',  authJwt(), ordersRouter);
app.use('/api/productReview', pReviewRouter);
app.use('/api/search', searchRouter);

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
  res.send('API Working');
});

// Start Server
const PORT = process.env.PORT || 5000; // Set a default port if env variable is not set
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
