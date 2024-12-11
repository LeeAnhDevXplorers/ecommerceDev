import express from 'express';
import { ProductSize } from '../models/productsSize.js';
const router = express.Router();

// GET all sizes
router.get('/', async (req, res) => {
  try {
    const sizes = await ProductSize.find().populate('sizeName', 'name');
    res.status(200).json({
      success: true,
      count: sizes.length,
      data: sizes
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Lỗi khi lấy danh sách kích thước',
      error: err.message
    });
  }
});

// GET size by ID
router.get('/:id', async (req, res) => {
  try {
    const size = await ProductSize.findById(req.params.id);
    if (!size) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy kích thước với ID này'
      });
    }
    res.status(200).json({
      success: true,
      data: size
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin kích thước',
      error: err.message
    });
  }
});

// CREATE new size
router.post('/create', async (req, res) => {
  try {
    const { sizeName } = req.body;

    // Validate input
    if (!sizeName || sizeName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Tên kích thước không được để trống'
      });
    }

    // Check if size already exists
    const existingSize = await ProductSize.findOne({ sizeName: sizeName });
    if (existingSize) {
      return res.status(400).json({
        success: false,
        message: 'Kích thước này đã tồn tại'
      });
    }

    const newSize = new ProductSize({ sizeName });
    const savedSize = await newSize.save();

    res.status(201).json({
      success: true,
      message: 'Tạo kích thước mới thành công',
      data: savedSize
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo kích thước mới',
      error: err.message
    });
  }
});

// UPDATE size
router.put('/:id', async (req, res) => {
  try {
    const { sizeName } = req.body;

    // Validate input
    if (!sizeName || sizeName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Tên kích thước không được để trống'
      });
    }

    // Check if size exists
    const existingSize = await ProductSize.findById(req.params.id);
    if (!existingSize) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy kích thước với ID này'
      });
    }

    // Check if new name already exists (excluding current size)
    const duplicateSize = await ProductSize.findOne({
      sizeName: sizeName,
      _id: { $ne: req.params.id }
    });
    if (duplicateSize) {
      return res.status(400).json({
        success: false,
        message: 'Kích thước với tên này đã tồn tại'
      });
    }

    const updateSize = await ProductSize.findByIdAndUpdate(
      req.params.id,
      { sizeName },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Cập nhật kích thước thành công',
      data: updateSize
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật kích thước',
      error: err.message
    });
  }
});

// DELETE size
router.delete('/:id', async (req, res) => {
  try {
    const deletedSize = await ProductSize.findByIdAndDelete(req.params.id);
    if (!deletedSize) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy kích thước với ID này'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa kích thước thành công',
      data: deletedSize
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa kích thước',
      error: err.message
    });
  }
});

export default router;