import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ApiError from '../utils/apiError.js';

// Setup local uploads destination directory
const uploadDir = path.join(process.cwd(), 'public/uploads');

// Ensure upload directory exists programmatically to avoid setup crashes
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Standardize filenames to avoid conflicts: fieldname-timestamp.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File Filter for Image validation
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp|gif/;
  const allowedMimeTypes = /image\/jpeg|image\/jpg|image\/png|image\/webp|image\/gif/;

  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedMimeTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  
  cb(new ApiError(400, 'Invalid file type. Only JPG, JPEG, PNG, WEBP, and GIF images are allowed.'));
};

// Configure Multer instance
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max file size limit
  }
});

export default upload;
