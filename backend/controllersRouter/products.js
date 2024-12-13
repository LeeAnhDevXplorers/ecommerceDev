import { v2 as cloudinary } from 'cloudinary';
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import multer from 'multer';
import pLimit from 'p-limit';
import { ProductWeigth } from '../models/productWeigths.js';
import { Products } from '../models/products.js';
import { ProductRams } from '../models/productsRams.js';
import { ProductSize } from '../models/productsSize.js';

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
});

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Utility function for uploading images to Cloudinary with concurrency limit
const uploadImages = async (images) => {
  const limit = pLimit(2); // Set a limit for concurrent uploads
  const uploadStatus = await Promise.all(
    images.map((image) =>
      limit(() =>
        cloudinary.uploader
          .upload(image.path)
          .then((result) => {
            fs.unlinkSync(image.path); // Delete the file after uploading
            return {
              success: true,
              url: result.url,
              publicId: result.public_id,
            };
          })
          .catch((error) => {
            return { success: false, error };
          })
      )
    )
  );
  return uploadStatus;
};

// Route to upload images locally, then upload to Cloudinary
router.post('/upload', upload.array('images'), async (req, res) => {
  const uploadedFiles = req.files.map((file) => file.filename);
  const cloudinaryUploadResults = await uploadImages(req.files);
  res.json({ uploadedFiles, cloudinaryUploadResults });
});

router.get('/', async (req, res) => {
  try {
    // Lấy thông tin phân trang
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 5; // Đặt mặc định là 10 sản phẩm/trang

    // Tạo đối tượng lọc
    const filter = {};

    // Lọc theo subName
    if (req.query.subName) {
      filter.subName = req.query.subName;
    }
    if (req.query.catName) {
      filter.catName = req.query.catName;
    }

    // Lọc theo khoảng giá
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) {
        filter.price.$gte = parseInt(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        filter.price.$lte = parseInt(req.query.maxPrice);
      }
    }

    // Tính tổng số sản phẩm
    const totalPosts = await Products.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / perPage);

    // Kiểm tra nếu trang vượt quá số trang tối đa
    if (page > totalPages && totalPages > 0) {
      return res.status(404).json({ message: 'Không tìm thấy trang' });
    }

    // Lấy danh sách sản phẩm với phân trang và lọc
    const productList = await Products.find(filter)
      .populate('category subCat weightName ramName sizeName')
      .skip((page - 1) * perPage)
      .limit(perPage);

    return res.status(200).json({
      data: productList,
      totalPages,
      page,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ', error });
  }
});

router.get('/featured', async (req, res) => {
  const productList = await Products.find({ isFeatured: true });
  if (!productList) {
    res.status(500).json({ success: false });
  }

  return res.status(200).json(productList);
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    const product = await Products.findById(id).populate([
      'category',
      'subCat',
      'weightName',
      'ramName',
      'sizeName',
    ]);

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: 'Đã xảy ra lỗi khi lấy thông tin sản phẩm',
      error: error.message,
    });
  }
});


router.post('/create', upload.array('images'), async (req, res) => {
  try {
    console.log('--- Debug Start: Product Creation ---');

    // Upload images
    const uploadStatus = await uploadImages(req.files);
    const imgUrls = uploadStatus
      .filter((item) => item.success)
      .map((item) => item.url);

    if (imgUrls.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Image upload failed.',
      });
    }

    const {
      name,
      category,
      subCat,
      catName,
      subName,
      description,
      brand,
      oldPrice,
      countInStock,
      discount,
      weightName,
      ramName,
      sizeName,
      isFeatured,
      location
    } = req.body;

    // Validate category and sub-category IDs
    if (
      !mongoose.isValidObjectId(category) ||
      !mongoose.isValidObjectId(subCat)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category or sub-category ID.',
      });
    }

    // Fetch optional attributes if provided
    let weightIds = [];
    if (weightName) {
      const weightDocs = await ProductWeigth.find({
        weightName: { $in: weightName.split(',') },
      });
      weightIds = weightDocs.map((doc) => doc._id);
    }

    let ramIds = [];
    if (ramName) {
      const ramDocs = await ProductRams.find({
        ramName: { $in: ramName.split(',') },
      });
      ramIds = ramDocs.map((doc) => doc._id);
    }

    let sizeIds = [];
    if (sizeName) {
      const sizeDocs = await ProductSize.find({
        sizeName: { $in: sizeName.split(',') },
      });
      sizeIds = sizeDocs.map((doc) => doc._id);
    }

    // Create the product
    const newProduct = new Products({
      name,
      description,
      images: imgUrls,
      brand,
      oldPrice,
      price: oldPrice * (1 - discount / 100), // Calculate price
      category,
      subCat,
      catName,
      subName,
      countInStock,
      discount,
      weightName: weightIds,
      ramName: ramIds,
      sizeName: sizeIds,
      isFeatured: isFeatured || false,
      location
    });

    const savedProduct = await newProduct.save();
    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product: savedProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error.',
      error: error.message,
    });
  }
});

// API PUT để cập nhật sản phẩm
router.put("/:id", upload.array("images"), async (req, res) => {
  try {
    console.log("Bắt đầu cập nhật sản phẩm với ID:", req.params.id);
    console.log("Dữ liệu nhận được từ client:", req.body); // Log toàn bộ dữ liệu nhận từ client

    // Tìm sản phẩm theo ID
    const product = await Products.findById(req.params.id);
    if (!product) {
      console.log("Không tìm thấy sản phẩm với ID:", req.params.id);
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm.",
      });
    }
    console.log("Sản phẩm tìm thấy:", product);

    // Kiểm tra các trường cần cập nhật, nếu không có dữ liệu thì set thành empty hoặc null
    const updateData = {
      name: req.body.name || product.name,
      description: req.body.description || product.description,
      images: req.body.images || product.images, // Giữ hình ảnh cũ nếu không có hình ảnh mới
      brand: req.body.brand || product.brand,
      oldPrice: req.body.oldPrice || product.oldPrice,
      category: req.body.category || product.category,
      subCat: req.body.subCat || product.subCat,
      catName: req.body.catName || product.catName,
      subName: req.body.subName || product.subName,
      countInStock: req.body.countInStock || product.countInStock,
      discount: req.body.discount || product.discount,
      location: req.body.location || product.location,

      // Nếu không có dữ liệu cho các trường weightName, ramName, sizeName, sẽ set thành null (hoặc mảng trống)
      weightName: req.body.weightName
        ? req.body.weightName.split(",")
        : product.weightName,
      ramName: req.body.ramName ? req.body.ramName.split(",") : product.ramName,
      sizeName: req.body.sizeName
        ? req.body.sizeName.split(",")
        : product.sizeName,

      isFeatured:
        req.body.isFeatured !== undefined
          ? req.body.isFeatured
          : product.isFeatured,
    };

    // Tính toán lại giá nếu có oldPrice và discount được cung cấp
    if (
      updateData.oldPrice &&
      updateData.discount >= 0 &&
      updateData.discount <= 100
    ) {
      updateData.price =
        updateData.oldPrice - (updateData.oldPrice * updateData.discount) / 100;
    } else {
      updateData.price = product.price; // Giữ giá cũ nếu không có dữ liệu mới
    }

    const updatedProduct = await Products.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    console.log("Sản phẩm đã được cập nhật thành công:", updatedProduct); // Log sản phẩm đã cập nhật
    return res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm thành công.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error.message);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ.",
      error: error.message,
    });
  }
});


// Delete product route
router.delete('/:id', async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found to delete' });
    }

    const cloudinaryDeletionPromises = product.images.map(async (image) => {
      const publicId = image.split('/').pop().split('.')[0];
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error('Error deleting image on Cloudinary:', error.message);
        }
      }
    });

    await Promise.all(cloudinaryDeletionPromises);
    await Products.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting product', error: error.message });
  }
});

export default router;
