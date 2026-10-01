import { getAggregatedAnalytics } from '../services/analyticsService.js';
import { successResponse } from '../utils/apiResponse.js';

export const getAnalytics = async (req, res, next) => {
  try {
    const analytics = await getAggregatedAnalytics();
    return successResponse(res, analytics, 'Analytics data retrieved successfully.', 200, {
      ...analytics
    });
  } catch (err) {
    next(err);
  }
};

export const getRecurringProblems = async (req, res, next) => {
  try {
    const analytics = await getAggregatedAnalytics();
    return successResponse(res, analytics.recurringProblems, 'Recurring problems retrieved successfully.');
  } catch (err) {
    next(err);
  }
};
