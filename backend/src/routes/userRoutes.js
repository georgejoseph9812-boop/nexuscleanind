import express from 'express';
import { getCurrentUser } from '../controllers/authController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', optionalAuth, getCurrentUser);

export default router;
