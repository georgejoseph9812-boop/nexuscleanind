import { databaseService } from '../services/databaseService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : 'USR-CITIZEN-01';
    const notifications = await databaseService.getNotifications(userId);
    return successResponse(res, notifications, 'Notifications retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await databaseService.markNotificationRead(id);

    if (!updated) {
      return errorResponse(res, 'NOT_FOUND', `Notification #${id} not found.`, 404);
    }

    return successResponse(res, updated, 'Notification marked as read.');
  } catch (err) {
    next(err);
  }
};
