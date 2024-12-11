import express from 'express';
import { SubCategory } from '../models/subCategory.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = req.query.perPage;
    const totalPosts = await SubCategory.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({ message: 'Không tìm thấy trang' });
    }
    let subCat = [];

    if (req.query.page !== undefined && req.query.perPage !== undefined) {
      subCat = await SubCategory.find()
        .populate('category subCat')
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    } else {
      subCat = await SubCategory.find().populate('category subCat');
    }
    subCat = await SubCategory.find().populate('category subCat');
    if (subCat.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'No subcategories found' });
    }
    // If subcategories are found, send them back
    res.status(200).json({ success: true, data: subCat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const subCat = await SubCategory.findById(req.params.id).populate('subCat');
    if (!subCat) {
      return res.status(404).json({
        message: 'Không tìm thấy danh mục có id đã cho',
      });
    }
    return res.status(200).send(subCat);
  } catch (err) {
    res.status(500).json({
      message: 'Đã xảy ra lỗi trong khi tìm kiếm danh mục',
      error: err.message,
    });
  }
});

router.post('/create', async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    const { category, subCat } = req.body;

    // Kiểm tra dữ liệu hợp lệ
    if (!category || !subCat) {
      return res.status(400).json({
        message: 'Both category and subcategory fields are required',
        success: false,
      });
    }

    // Kiểm tra xem danh mục phụ đã tồn tại với danh mục chính chưa
    const existingSubCat = await SubCategory.findOne({ category, subCat });
    if (existingSubCat) {
      return res.status(400).json({
        message: 'Subcategory already exists for this category',
        success: false,
      });
    }

    let subCatEntity = new SubCategory({ category, subCat });
    subCatEntity = await subCatEntity.save();

    return res.status(201).json({
      message: 'Subcategory created successfully',
      subCat: subCatEntity,
      success: true,
    });
  } catch (err) {
    console.error('Error creating subcategory:', err.message);
    return res.status(500).json({
      error: err.message || 'Internal server error',
      success: false,
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const subCat = await SubCategory.findById(req.params.id);
    if (!subCat) {
      return res.status(404).json({
        message: 'Không tìm thấy danh mục',
        success: false,
      });
    }

    // Xóa danh mục sau khi xóa ảnh thành công
    const deletedSubCategory = await SubCategory.findByIdAndDelete(
      req.params.id
    );
    if (!deletedSubCategory) {
      return res.status(404).json({
        message: 'Không tìm thấy danh mục',
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Đã xóa danh mục thành công',
    });
  } catch (err) {
    console.error('Lỗi trong quá trình xóa:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi xóa danh mục và ảnh',
      error: err.message,
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Ensure the required fields are provided in the request body
    const { category, subCat } = req.body;
    if (!category || !subCat) {
      return res.status(400).json({
        message: 'Both category and subcategory fields are required',
        success: false,
      });
    }

    // Retrieve the existing category
    const existingCategory = await SubCategory.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({
        message: 'Category not found',
        success: false,
      });
    }

    // Update the category and subcategory fields
    const updatedCategory = await SubCategory.findByIdAndUpdate(
      categoryId,
      { category, subCat },
      { new: true } // Return the updated document
    );

    // If the category could not be updated
    if (!updatedCategory) {
      return res.status(500).json({
        message: 'Unable to update the category',
        success: false,
      });
    }

    // Respond with the updated category
    return res.status(200).json({
      message: 'Category updated successfully',
      category: updatedCategory,
      success: true,
    });
  } catch (error) {
    console.error('Error updating category:', error.message);
    return res.status(500).json({
      message: 'An error occurred while updating the category',
      success: false,
      error: error.message,
    });
  }
});

export default router;
