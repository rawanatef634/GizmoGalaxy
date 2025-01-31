import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// ✅ Ensure 'uploads/' directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save in /uploads
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`); // Unique filename
  },
});

// ✅ File Filter (Only Images Allowed)
const fileFilter = (req, file, cb) => {
  console.log("🔍 File received:", file); // Debugging log

  const allowedTypes = /jpeg|jpg|png|webp/;
  const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isValidMime = allowedTypes.test(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error("❌ Only JPEG, JPG, PNG, and WEBP images are allowed!"), false);
  }
};

// ✅ Multer Upload Instance (Max File Size: 2MB)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// ✅ Image Upload Route
router.post("/", upload.single("image"), (req, res) => {
  console.log("📩 Request received!");

  // 🔍 Debugging: Check file presence
  if (!req.file) {
    console.error("❌ No file uploaded!");
    return res.status(400).json({ message: "No file uploaded. Make sure you're sending 'image' in form-data." });
  }

  console.log("✅ File uploaded successfully:", req.file);

  // ✅ Respond with file path
  res.status(200).json({
    message: "✅ Image uploaded successfully!",
    imagePath: `/uploads/${req.file.filename}`,
  });
});

// ✅ Global Error Handling Middleware
router.use((err, req, res, next) => {
  console.error("⚠️ Error:", err.message);
  res.status(500).json({ message: err.message || "Server error" });
});

export default router;
