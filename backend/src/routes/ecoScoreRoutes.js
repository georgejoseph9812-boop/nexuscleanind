import express from 'express';
import {
  getEcoScore,
  addActivity
} from '../controllers/ecoScoreController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getEcoScore);
router.post('/activity', optionalAuth, addActivity);

export default router;
