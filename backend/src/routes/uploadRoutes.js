import express from 'express';
import { uploadDisk } from '../middleware/upload.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const router = express.Router();

router.post('/', uploadDisk.single('file'), (req, res) => {
  if (!req.file) {
    return errorResponse(res, 'NO_FILE_UPLOADED', 'No file was uploaded.', 400);
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  return successResponse(res, {
    url: fileUrl,
    fileName: req.file.filename,
    fileType: req.file.mimetype,
    size: req.file.size
  }, 'File uploaded successfully.', 201);
});

export default router;
