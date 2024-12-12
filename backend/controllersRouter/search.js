import express from 'express';
import { Products } from '../models/products.js';

const router = express.Router();

// API route
router.get('/', async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ msg: 'Query is required' });
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
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
