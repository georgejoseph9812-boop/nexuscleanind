import { databaseService } from '../services/databaseService.js';
import { successResponse } from '../utils/apiResponse.js';

export const getAwareness = async (req, res, next) => {
  try {
    const categories = await databaseService.getAwareness();
    return successResponse(res, categories, 'Waste awareness guide retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

export const getQuiz = async (req, res, next) => {
  try {
    const items = await databaseService.getQuizItems();
    return successResponse(res, items, 'Interactive waste sorting quiz items retrieved successfully.');
  } catch (err) {
    next(err);
  }
};
