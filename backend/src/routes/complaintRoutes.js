import express from 'express';
import {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint
} from '../controllers/complaintController.js';
import { validate } from '../middleware/validate.js';
import { validateComplaintCreate, validateComplaintStatus } from '../validators/complaintValidator.js';
import { optionalAuth } from '../middleware/auth.js';
import { uploadDisk } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getComplaints);
router.get('/:id', getComplaintById);
router.post('/', optionalAuth, uploadDisk.single('photo'), validate(validateComplaintCreate), createComplaint);
router.patch('/:id', optionalAuth, updateComplaint);
router.patch('/:id/status', optionalAuth, uploadDisk.single('afterImage'), validate(validateComplaintStatus), updateComplaintStatus);
router.delete('/:id', optionalAuth, deleteComplaint);

export default router;
