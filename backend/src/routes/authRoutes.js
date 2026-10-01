import express from 'express';
import { register, login, logout, getCurrentUser } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { validateRegister, validateLogin } from '../validators/authValidator.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', validate(validateRegister), register);
router.post('/login', validate(validateLogin), login);
router.post('/logout', logout);
router.get('/me', authenticate, getCurrentUser);

export default router;
