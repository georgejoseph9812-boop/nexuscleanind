import express from 'express';
import {
  getAwareness,
  getQuiz
} from '../controllers/awarenessController.js';

const router = express.Router();

router.get('/', getAwareness);
router.get('/quiz', getQuiz);

export default router;
