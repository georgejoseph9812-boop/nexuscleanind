import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Memory storage for fast AI processing & Supabase uploads
const memoryStorage = multer.memoryStorage();

// Disk storage for local file persistence
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `waste-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const isMimeOk = allowed.test(file.mimetype);
  const isExtOk = allowed.test(path.extname(file.originalname).toLowerCase());

  if (isMimeOk && isExtOk) {
    return cb(null, true);
  }
  cb(new Error('Only image files (jpg, jpeg, png, webp) are permitted.'));
};

export const uploadMemory = multer({
  storage: memoryStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter
});

export const uploadDisk = multer({
  storage: diskStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter
});
