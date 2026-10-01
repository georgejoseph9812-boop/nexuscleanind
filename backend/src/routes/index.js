import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import complaintRoutes from './complaintRoutes.js';
import pickupRoutes from './pickupRoutes.js';
import hotspotRoutes from './hotspotRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import aiRoutes from './aiRoutes.js';
import ecoScoreRoutes from './ecoScoreRoutes.js';
import awarenessRoutes from './awarenessRoutes.js';
import adminRoutes from './adminRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Nexus Clean API is running',
    timestamp: new Date().toISOString(),
    service: 'Nexus Clean Backend',
    tagline: "Don't Just Report Waste. Predict It."
  });
});

// Mount modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/complaints', complaintRoutes);
router.use('/pickups', pickupRoutes);
router.use('/hotspots', hotspotRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/ai', aiRoutes);
router.use('/eco-score', ecoScoreRoutes);
router.use('/awareness', awarenessRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);
router.use('/upload', uploadRoutes);

export default router;
