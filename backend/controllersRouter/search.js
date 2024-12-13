import express from 'express';
import { Products } from '../models/products.js';

const router = express.Router();

// API route
router.get('/', async (req, res) => {
  try {
    // Lấy truy vấn và loại bỏ khoảng trắng đầu cuối
    const query = req.query.q?.trim();

    if (!query || query.length === 0) {
      return res.status(400).json({ msg: 'Truy vấn không được để trống' });
    }

    // Sử dụng collation để hỗ trợ tìm kiếm tiếng Việt
    const items = await Products.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
        { catName: { $regex: query, $options: 'i' } },
      ],
    }).collation({ locale: 'vi', strength: 1 }); // strength: 1 để không phân biệt dấu

    res.json(items);
  } catch (error) {
    console.error('Lỗi server:', error);
    res.status(500).json({ msg: 'Có lỗi xảy ra từ phía server, vui lòng thử lại sau' });
  }
});

export default router;
