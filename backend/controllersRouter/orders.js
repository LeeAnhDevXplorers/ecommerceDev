import express from 'express';
import { Orders } from '../models/orders.js';
const router = express.Router();

// GET endpoint to fetch orders for a specific user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId; // Lấy userId từ query parameters
    const page = parseInt(req.query.page) || 1;
    const perPage = 8;

    // Kiểm tra xem userId có được cung cấp không
    if (!userId) {
      return res.status(400).json({ msg: 'userId is required' });
    }

    // Tính tổng số đơn hàng cho userId cụ thể
    const totalPosts = await Orders.countDocuments({ userId: userId });
    const totalPages = Math.ceil(totalPosts / perPage);

    // Kiểm tra xem trang yêu cầu có hợp lệ không
    if (page > totalPages) {
      return res.status(404).json({ msg: 'No orders found for this user' });
    }

    // Lấy các đơn hàng cho userId cụ thể
    const orders = await Orders.find({ userId: userId })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    // Trả về dữ liệu đơn hàng
    res.status(200).json({
      data: orders,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// GET endpoint to fetch a specific order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Orders.findById(req.params.id); // Lấy đơn hàng theo ID
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching order', error: error.message });
  }
});

router.post('/create', async (req, res) => {
  try {
    // Logging để kiểm tra payload nhận được từ client
    console.log('Payload received:', req.body);

    // Tạo một đơn hàng mới từ dữ liệu client gửi
    const order = new Orders({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      pincode: req.body.pincode,
      amount: req.body.amount,
      paymentId: req.body.paymentId,
      email: req.body.email,
      userId: req.body.userId, // Đảm bảo trường này được gửi đầy đủ
      products: req.body.products,
    });

    // Lưu vào cơ sở dữ liệu
    const savedOrder = await order.save();

    // Trả về phản hồi thành công
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Error while creating order:', err);

    // Trả về phản hồi lỗi
    res.status(400).json({
      success: false,
      message: 'Order creation failed.',
      error: err.message,
    });
  }
});

// DELETE endpoint to remove an order by ID
router.delete('/:id', async (req, res) => {
  try {
    const order = await Orders.findByIdAndDelete(req.params.id); // Xóa đơn hàng theo ID
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully', order });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting order', error: error.message });
  }
});

export default router;
