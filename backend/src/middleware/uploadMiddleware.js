
import multer from "multer";

// 1. Configure Multer
const storage = multer.memoryStorage();

// 2. Validate uploaded files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

// 3. Create Multer upload middleware
const upload = multer({
  storage: storage,

  limits: {
    fileSize: 10 * 1024 * 1024
  },

  fileFilter: fileFilter
});

// 4. Export middleware
export default upload;
