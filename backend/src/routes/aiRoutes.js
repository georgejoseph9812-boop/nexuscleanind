import express from 'express';
import {
  analyzeWaste,
  verifyResolution
} from '../controllers/aiController.js';
import { uploadMemory } from '../middleware/upload.js';

const router = express.Router();

router.post('/analyze-waste', uploadMemory.single('image'), analyzeWaste);
router.post('/verify-resolution', verifyResolution);

export default router;
