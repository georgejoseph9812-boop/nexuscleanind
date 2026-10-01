import express from 'express';
import {
  getAnalytics,
  getRecurringProblems
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/', getAnalytics);
router.get('/recurring-problems', getRecurringProblems);

export default router;
