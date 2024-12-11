import express from 'express';
import { ProductReviews } from '../models/productReviews.js';
import mongoose from 'mongoose';
const router = express.Router();

// Lấy danh sách tất cả các review
// Lấy danh sách đánh giá
router.get('/', async (req, res) => {
  try {
    const { productId } = req.query;

    if (productId) {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        console.error(`Invalid productId: ${productId}`);
        return res
          .status(400)
          .json({ success: false, message: 'productId không hợp lệ.' });
      }

      // Truy vấn MongoDB
      const reviews = await ProductReviews.find({ productId });
      if (!reviews || reviews.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'Không tìm thấy đánh giá nào.' });
      }

      return res.status(200).json(reviews);
    } else {
      // Nếu không có productId
      const reviews = await ProductReviews.find();
      return res.status(200).json(reviews);
    }
  } catch (error) {
    console.error('Error fetching reviews:', error); // Ghi lỗi chi tiết
    return res
      .status(500)
      .json({ success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' });
  }
});

// Lấy review theo ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra nếu ID không hợp lệ
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID không hợp lệ.' });
    }

    // Tìm đánh giá theo ID
    const review = await ProductReviews.findById(id);
    if (!review) {
      return res
        .status(404)
        .json({ message: 'Không tìm thấy đánh giá với ID đã cho.' });
    }

    // Trả về đánh giá
    return res.status(200).json(review);
  } catch (error) {
    console.error('Error fetching review by ID:', error);
    return res
      .status(500)
      .json({ message: 'Lỗi hệ thống. Vui lòng thử lại sau.' });
  }
});

// Thêm mới review
router.post('/add', async (req, res) => {
  try {
    let review = new ProductReviews({
      customerId: req.body.customerId,
      customerName: req.body.customerName,
      review: req.body.review,
      customerRating: req.body.customerRating,
      productId: req.body.productId,
    });

    review = await review.save();
    return res.status(201).json(review);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: 'Thêm đánh giá thất bại.',
    });
  }
});

// Cập nhật review
router.put('/:id', async (req, res) => {
  try {
    const updatedReview = await ProductReviews.findByIdAndUpdate(
      req.params.id,
      {
        customerId: req.body.customerId,
        customerName: req.body.customerName,
        review: req.body.review,
        customerRating: req.body.customerRating,
        productId: req.body.productId,
      },
      { new: true } // Trả về bản ghi mới sau khi cập nhật
    );

    if (!updatedReview) {
      return res
        .status(404)
        .json({ message: 'Không tìm thấy đánh giá để cập nhật.' });
    }

    return res
      .status(200)
      .json({ message: 'Cập nhật đánh giá thành công.', data: updatedReview });
  } catch (error) {
    return res.status(500).json({
      message: 'Cập nhật thất bại. Vui lòng thử lại sau.',
      error: error.message,
    });
  }
});

// Xóa review
router.delete('/:id', async (req, res) => {
  try {
    const deletedReview = await ProductReviews.findByIdAndRemove(req.params.id);

    if (!deletedReview) {
      return res
        .status(404)
        .json({ message: 'Không tìm thấy đánh giá để xóa.' });
    }

    return res.status(200).json({ message: 'Xóa đánh giá thành công.' });
  } catch (error) {
    return res.status(500).json({
      message: 'Xóa đánh giá thất bại. Vui lòng thử lại sau.',
      error: error.message,
    });
  }
});

export default router;
