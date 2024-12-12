import { v2 as cloudinary } from 'cloudinary';
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import pLimit from 'p-limit';
import { HomeBanner } from '../models/homeBanner.js';

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
            // Clean up locally saved file after successful upload
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
    const page = parseInt(req.query.page) || 1;
    const perPage = 20;
    const totalPosts = await Category.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({ message: 'Không tìm thấy trang' });
    }
    const categoryList = await Category.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();
    if (!categoryList) {
      res.status(500).json({ success: false });
    }
    return res.status(200).json({
      categoryList: categoryList,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        message: 'Không tìm thấy danh mục có id đã cho',
      });
    }
    return res.status(200).send(category);
  } catch (err) {
    res.status(500).json({
      message: 'Đã xảy ra lỗi trong khi tìm kiếm danh mục',
      error: err.message,
    });
  }
});

// Route tạo mới category với ảnh, giữ lại file trong thư mục 'uploads'
// POST: Tải một ảnh lên Cloudinary
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const uploadedFile = req.file;
    const cloudinaryUploadResult = await uploadImage(uploadedFile);
    res.json({ uploadedFile, cloudinaryUploadResult });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading image' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        message: 'Không tìm thấy danh mục',
        success: false,
      });
    }

    const images = category.images; // List of image URLs or Cloudinary public IDs

    // Xóa ảnh cục bộ (nếu lưu đường dẫn ảnh trong hệ thống cục bộ)
    for (const imagePath of images) {
      const localFileName = imagePath.split('/').pop(); // Lấy tên file từ đường dẫn
      const localPath = `uploads/${localFileName}`; // Tạo đường dẫn cục bộ tới file

      try {
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath); // Xóa file từ thư mục uploads nếu tồn tại
        }
      } catch (error) {
        console.error('Lỗi khi xóa ảnh cục bộ:', error.message);
      }
    }

    // Xóa ảnh trên Cloudinary
    const cloudinaryDeletionPromises = images.map(async (image) => {
      const publicId = image.publicId || image.split('/').pop().split('.')[0]; // Sử dụng public_id hoặc lấy từ URL
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId); // Xóa ảnh từ Cloudinary bằng publicId
        } catch (error) {
          console.error('Lỗi khi xóa ảnh trên Cloudinary:', error.message);
        }
      }
    });

    await Promise.all(cloudinaryDeletionPromises);

    // Xóa danh mục sau khi xóa ảnh thành công
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({
        message: 'Không tìm thấy danh mục',
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Đã xóa danh mục và ảnh thành công',
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

// router.put('/:id', upload.array('images'), async (req, res) => {
//   try {
//     const limit = pLimit(2); // Limit concurrent requests
//     const categoryId = req.params.id;

//     // Retrieve the existing category
//     const existingCategory = await Category.findById(categoryId);
//     if (!existingCategory) {
//       return res.status(404).json({
//         message: 'Category not found',
//         success: false,
//       });
//     }

//     // Separate the images into new uploads and retained images
//     const newImages = req.files || []; // New uploaded images from form-data
//     const retainedImages = req.body.retainedImages || []; // Images user wants to keep (defaults to an empty array if not provided)

//     // Filter out images that need to be deleted
//     const imagesToDelete = existingCategory.images.filter(
//       (img) => !retainedImages.includes(img)
//     );

//     // Delete images that are not retained from Cloudinary
//     // const deletionPromises = imagesToDelete.map((image) =>
//     //   limit(() => {
//     //     const publicId = image.publicId || image.split('/').pop().split('.')[0];
//     //     return cloudinary.uploader.destroy(publicId).catch((error) => {
//     //       console.error('Error deleting image from Cloudinary:', error.message);
//     //       return null;
//     //     });
//     //   })
//     // );
//     // await Promise.all(deletionPromises);

//     // Upload new images to Cloudinary
//     const uploadResults = await Promise.all(
//       newImages.map((image) =>
//         limit(() =>
//           cloudinary.uploader.upload(image.path).then((result) => {
//             fs.unlinkSync(image.path); // Delete local file after uploading
//             return result.url; // Return only the URL to save in the database
//           })
//         )
//       )
//     );

//     // Combine retained images and newly uploaded images
//     const updatedImages = [...retainedImages, ...uploadResults];

//     // Update the category in the database
//     const updatedCategory = await Category.findByIdAndUpdate(
//       categoryId,
//       {
//         name: req.body.name,
//         images: updatedImages,
//         color: req.body.color,
//       },
//       { new: true }
//     );

//     if (!updatedCategory) {
//       return res.status(500).json({
//         message: 'Unable to update the category',
//         success: false,
//       });
//     }

//     // Respond with the updated category
//     return res.status(200).json({
//       message: 'Category updated successfully',
//       category: updatedCategory,
//       success: true,
//     });
//   } catch (error) {
//     console.error('Error updating category:', error.message);
//     return res.status(500).json({
//       message: 'An error occurred while updating the category',
//       success: false,
//       error: error.message,
//     });
//   }
// });

router.put('/:id', upload.array('images'), async (req, res) => {
  try {
    const limit = pLimit(2); // Giới hạn số lượng yêu cầu song song
    const categoryId = req.params.id;

    // Lấy danh mục hiện tại từ cơ sở dữ liệu
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({
        message: 'Không tìm thấy danh mục',
        success: false,
      });
    }

    const newImages = req.files || []; // Ảnh mới tải lên từ form-data

    if (newImages.length === 0) {
      // Nếu không có ảnh mới, xóa toàn bộ ảnh cũ trên Cloudinary
      const deletionPromises = existingCategory.images.map((image) =>
        limit(() => {
          const publicId = image.split('/').pop().split('.')[0]; // Lấy public_id từ URL
          return cloudinary.uploader.destroy(publicId).catch((error) => {
            console.error('Lỗi khi xóa ảnh trên Cloudinary:', error.message);
            return null; // Tiếp tục ngay cả khi lỗi xảy ra
          });
        })
      );
      await Promise.all(deletionPromises);

      // Xóa danh sách ảnh trong database
      existingCategory.images = [];
    } else {
      // Nếu có ảnh mới, xóa toàn bộ ảnh cũ và thêm ảnh mới
      const deletionPromises = existingCategory.images.map((image) =>
        limit(() => {
          const publicId = image.split('/').pop().split('.')[0]; // Lấy public_id từ URL
          return cloudinary.uploader.destroy(publicId).catch((error) => {
            console.error('Lỗi khi xóa ảnh trên Cloudinary:', error.message);
            return null; // Tiếp tục ngay cả khi lỗi xảy ra
          });
        })
      );
      await Promise.all(deletionPromises);

      // Upload ảnh mới lên Cloudinary
      const uploadResults = await Promise.all(
        newImages.map((image) =>
          limit(() =>
            cloudinary.uploader.upload(image.path).then((result) => {
              fs.unlinkSync(image.path); // Xóa file cục bộ sau khi upload
              return result.url; // Lấy URL để lưu vào cơ sở dữ liệu
            })
          )
        )
      );

      // Cập nhật danh sách ảnh trong database
      existingCategory.images = uploadResults;
    }

    // Cập nhật các trường khác của danh mục
    existingCategory.name = req.body.name;
    existingCategory.color = req.body.color;

    const updatedCategory = await existingCategory.save();

    return res.status(200).json({
      message: 'Cập nhật danh mục thành công',
      category: updatedCategory,
      success: true,
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật danh mục:', error.message);
    return res.status(500).json({
      message: 'Đã xảy ra lỗi trong quá trình cập nhật danh mục',
      success: false,
      error: error.message,
    });
  }
});

export default router;
