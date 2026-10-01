import express from 'express';
import {
  getHotspots,
  getHotspotById,
  regenerateForecast
} from '../controllers/hotspotController.js';

const router = express.Router();

router.get('/', getHotspots);
router.get('/:id', getHotspotById);
router.post('/regenerate', regenerateForecast);

export default router;
