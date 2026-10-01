import { getUserEcoScore, recordEcoActivity } from '../services/ecoScoreService.js';
import { successResponse } from '../utils/apiResponse.js';

export const getEcoScore = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : (req.query.userId || 'USR-CITIZEN-01');
    const ecoScore = await getUserEcoScore(userId);

    return successResponse(res, ecoScore, 'Eco Score retrieved successfully.', 200, {
      ...ecoScore
    });
  } catch (err) {
    next(err);
  }
};

export const addActivity = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : 'USR-CITIZEN-01';
    const { activityType, points, description } = req.body;

    const record = await recordEcoActivity(userId, {
      activityType: activityType || 'awareness_quiz',
      points: points || 5,
      description: description || 'Civic sanitation action completed'
    });

    const updatedScore = await getUserEcoScore(userId);

    return successResponse(res, { record, ecoScore: updatedScore }, 'Eco activity recorded successfully.', 201);
  } catch (err) {
    next(err);
  }
};
