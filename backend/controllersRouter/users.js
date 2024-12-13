import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { Users } from "../models/users.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import pLimit from "p-limit";

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
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
router.post("/upload", upload.array("images"), async (req, res) => {
  const uploadedFiles = req.files.map((file) => file.filename);
  const cloudinaryUploadResults = await uploadImages(req.files);
  res.json({ uploadedFiles, cloudinaryUploadResults });
});

router.get("/", async (req, res) => {
  const userList = await Users.find();
  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

router.get("/:id", async (req, res) => {
  const user = await Users.findById(req.params.id);
  if (!user) {
    res.status(500).json({ msg: "the user ID not found" });
  }
  res.status(200).send(user);
});

router.get("/get/count", async (req, res) => {
  const userCount = await Users.countDocuments((count) => count);
  if (!userCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    userCount: userCount,
  });
});

router.post("/signup", async (req, res) => {
  const { name, phone, email, password } = req.body;

  if (!name || !phone || !email || !password) {
    return res
      .status(400)
      .json({ status: false, msg: "Không được để trống các trường!" });
  }

  try {
    const existingEmail = await Users.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ status: false, msg: "Email đã tồn tại!" });
    }

    const existingPhone = await Users.findOne({ phone });
    if (existingPhone) {
      return res
        .status(400)
        .json({ status: false, msg: "Số điện thoại đã tồn tại!" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const result = await Users.create({
      name,
      phone,
      email,
      password: hashPassword,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.JSON_WEB_TOKEN_SECRET_KEY
    );

    res.status(201).json({ status: true, user: result, token });
  } catch (error) {
    console.error("Error during signup:", error.message, error.stack);
    res
      .status(500)
      .json({ status: false, msg: "Có lỗi xảy ra, vui lòng thử lại!" });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Tìm người dùng theo email
    const existingUser = await Users.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        status: false,
        msg: "Email không tồn tại.",
      });
    }

    // Kiểm tra mật khẩu
    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(401).json({
        status: false,
        msg: "Sai mật khẩu.",
      });
    }

    // Tạo token JWT
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JSON_WEB_TOKEN_SECRET_KEY
    );

    // Phản hồi thành công
    res.status(200).json({
      status: true,
      user: {
        name: existingUser.name,
        email: existingUser.email,
        _id: existingUser._id,
      },
      token,
      msg: "Đăng nhập thành công.",
    });
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({
      status: false,
      msg: "Lỗi hệ thống. Vui lòng thử lại sau.",
    });
  }
});
router.put("/:id", upload.array("images"), async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    const userExist = await Users.findById(req.params.id);
    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }
    let newPass = password
      ? bcrypt.hashSync(password, 10)
      : userExist.passwordHash;
    let imageUrls = userExist.images;
    if (req.files && req.files.length > 0) {
      const uploadResults = await uploadImages(req.files);
      const successfulUploads = uploadResults.filter(
        (result) => result.success
      );
      imageUrls = successfulUploads.map((result) => result.url);
    }
    const updatedUser = await Users.findByIdAndUpdate(
      req.params.id,
      {
        name: name || userExist.name,
        phone: phone || userExist.phone,
        email: email || userExist.email,
        passwordHash: newPass,
        images: imageUrls,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.delete("/:id", async (req, res) => {
  Users.findByIdAndDelete(req.params.id).then((user) => {
    if (user) {
      return res.status(200).json({ success: true, msg: "delete complate" });
    } else {
      return res.status(404).json({ success: false });
    }
  });
});

export default router;
