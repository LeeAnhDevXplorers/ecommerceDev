import express from 'express';
import { ProductRams } from '../models/productsRams.js';
const router = express.Router();

// GET all RAM products
router.get('/', async (req, res) => {
  try {
    const prams = await ProductRams.find().populate('ramName', 'name');
    res.status(200).json({
      success: true,
      count: prams.length,
      data: prams,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách RAM',
      error: err.message,
    });
  }
});

// GET RAM by ID
router.get('/:id', async (req, res) => {
  try {
    const prams = await ProductRams.findById(req.params.id);
    if (!prams) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy RAM với ID này',
      });
    }
    res.status(200).json({
      success: true,
      data: prams,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin RAM',
      error: err.message,
    });
  }
});

// CREATE new RAM
router.post('/create', async (req, res) => {
  try {
    const { ramName } = req.body;

    // Validate input
    if (!ramName || ramName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Tên RAM không được để trống',
      });
    }

    // Check if RAM already exists
    const existingRam = await ProductRams.findOne({ ramName: ramName });
    if (existingRam) {
      return res.status(400).json({
        success: false,
        message: 'RAM này đã tồn tại',
      });
    }

    const newRams = new ProductRams({ ramName });
    const savedRam = await newRams.save();

    res.status(201).json({
      success: true,
      message: 'Tạo RAM thành công',
      data: savedRam,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo RAM mới',
      error: err.message,
    });
  }
});

// UPDATE RAM
router.put('/:id', async (req, res) => {
  try {
    const { ramName } = req.body;

    // Validate input
    if (!ramName || ramName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Tên RAM không được để trống',
      });
    }

    // Check if RAM exists
    const existingRam = await ProductRams.findById(req.params.id);
    if (!existingRam) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy RAM với ID này',
      });
    }

    // Check if new name already exists (excluding current RAM)
    const duplicateRam = await ProductRams.findOne({
      ramName: ramName,
      _id: { $ne: req.params.id },
    });
    if (duplicateRam) {
      return res.status(400).json({
        success: false,
        message: 'RAM với tên này đã tồn tại',
      });
    }

    const updateRams = await ProductRams.findByIdAndUpdate(
      req.params.id,
      { ramName },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Cập nhật RAM thành công',
      data: updateRams,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật RAM',
      error: err.message,
    });
  }
});

// DELETE RAM
router.delete('/:id', async (req, res) => {
  try { 
    const deletedSize = await ProductRams.findByIdAndDelete(req.params.id);
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
