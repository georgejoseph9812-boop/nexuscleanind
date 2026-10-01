import express from 'express';
import {
  getPickups,
  getPickupById,
  createPickup,
  updatePickupStatus,
  deletePickup
} from '../controllers/pickupController.js';
import { validate } from '../middleware/validate.js';
import { validatePickupCreate } from '../validators/pickupValidator.js';
import { optionalAuth } from '../middleware/auth.js';
import { uploadDisk } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getPickups);
router.get('/:id', getPickupById);
router.post('/', optionalAuth, uploadDisk.single('photo'), validate(validatePickupCreate), createPickup);
router.patch('/:id/status', optionalAuth, updatePickupStatus);
router.delete('/:id', optionalAuth, deletePickup);

export default router;
