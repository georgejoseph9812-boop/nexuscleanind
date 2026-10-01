import express from 'express';
import {
  getDashboard,
  getAdminPickups,
  getPickupRecommendations
} from '../controllers/adminController.js';
import { getComplaints } from '../controllers/complaintController.js';
import { getHotspots } from '../controllers/hotspotController.js';
import { getAnalytics } from '../controllers/analyticsController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(optionalAuth);

router.get('/dashboard', getDashboard);
router.get('/pickups', getAdminPickups);
router.get('/pickups/recommendations', getPickupRecommendations);
router.get('/complaints', getComplaints);
router.get('/hotspots', getHotspots);
router.get('/analytics', getAnalytics);

export default router;
