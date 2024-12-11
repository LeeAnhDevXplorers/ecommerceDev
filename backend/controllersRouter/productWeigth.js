import express from 'express';
import { ProductWeigth } from '../models/productWeigths.js';
const router = express.Router();

// GET all weights
router.get('/', async (req, res) => {
  try {
    const weights = await ProductWeigth.find().populate('weightName', 'name');
    res.status(200).json({
      success: true,
      count: weights.length,
      data: weights,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách trọng lượng',
      error: err.message,
    });
  }
});

// GET weight by ID
router.get('/:id', async (req, res) => {
  try {
    const weight = await ProductWeigth.findById(req.params.id);
    if (!weight) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy trọng lượng với ID này',
      });
    }
    res.status(200).json({
      success: true,
      data: weight,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin trọng lượng',
      error: err.message,
    });
  }
});

// CREATE new weight
router.post('/create', async (req, res) => {
  try {
    const { weightName } = req.body;

    // Validate input
    if (!weightName || weightName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Tên trọng lượng không được để trống',
      });
    }

    // Check if weight already exists
    const existingWeight = await ProductWeigth.findOne({
      weightName: weightName,
    });
    if (existingWeight) {
      return res.status(400).json({
        success: false,
        message: 'Trọng lượng này đã tồn tại',
      });
    }

    const newWeight = new ProductWeigth({ weightName });
    const savedWeight = await newWeight.save();

    res.status(201).json({
      success: true,
      message: 'Tạo trọng lượng mới thành công',
      data: savedWeight,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo trọng lượng mới',
      error: err.message,
    });
  }
});

// UPDATE weight
router.put('/:id', async (req, res) => {
  try {
    const { weightName } = req.body;

    // Validate input
    if (!weightName || weightName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Tên trọng lượng không được để trống',
      });
    }

    // Check if weight exists
    const existingWeight = await ProductWeigth.findById(req.params.id);
    if (!existingWeight) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy trọng lượng với ID này',
      });
    }

    // Check if new name already exists (excluding current weight)
    const duplicateWeight = await ProductWeigth.findOne({
      weightName: weightName,
      _id: { $ne: req.params.id },
    });
    if (duplicateWeight) {
      return res.status(400).json({
        success: false,
        message: 'Trọng lượng với tên này đã tồn tại',
      });
    }

    const updatedWeight = await ProductWeigth.findByIdAndUpdate(
      req.params.id,
      { weightName },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Cập nhật trọng lượng thành công',
      data: updatedWeight,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật trọng lượng',
      error: err.message,
    });
  }
});

// DELETE weight
router.delete('/:id', async (req, res) => {
  try {
    const deletedWeight = await ProductWeigth.findByIdAndDelete(req.params.id);
    if (!deletedWeight) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy trọng lượng với ID này',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa trọng lượng thành công',
      data: deletedWeight,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa trọng lượng',
      error: err.message,
    });
  }
});

export default router;
