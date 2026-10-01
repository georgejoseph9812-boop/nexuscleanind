import { databaseService } from '../services/databaseService.js';
import { getSmartRouteRecommendation } from '../services/pickupService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getPickups = async (req, res, next) => {
  try {
    const list = await databaseService.getPickups();
    const smartRoute = getSmartRouteRecommendation(list);

    return successResponse(res, list, 'Pickups retrieved successfully.', 200, {
      smartRoute
    });
  } catch (err) {
    next(err);
  }
};

export const getPickupById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pickup = await databaseService.getPickupById(id);

    if (!pickup) {
      return errorResponse(res, 'NOT_FOUND', `Pickup request #${id} not found.`, 404);
    }

    return successResponse(res, pickup, 'Pickup details retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

export const createPickup = async (req, res, next) => {
  try {
    const {
      wasteType,
      estimatedQuantity,
      address,
      area,
      zone,
      preferredDate,
      preferredTime,
      photo,
      priority,
      requesterName,
      requesterPhone
    } = req.body;

    let finalPhoto = photo;
    if (req.file) {
      finalPhoto = `/uploads/${req.file.filename}`;
    }

    const pickupData = {
      userId: req.user ? req.user.id : 'USR-CITIZEN-01',
      requesterName: requesterName || (req.user ? req.user.name : 'Aarav Sharma'),
      requesterPhone: requesterPhone || (req.user ? req.user.phone : '+91 98765 43210'),
      wasteType,
      estimatedQuantity: estimatedQuantity || 'Standard Collection Sack',
      address,
      area: area || 'Civil Lines',
      zone: zone || 'Zone 3',
      preferredDate,
      preferredTime: preferredTime || '10:00 AM - 12:00 PM',
      photo: finalPhoto,
      priority: priority || 'Medium'
    };

    const newPickup = await databaseService.createPickup(pickupData);
    return successResponse(res, newPickup, 'Pickup request registered successfully.', 201);
  } catch (err) {
    next(err);
  }
};

export const updatePickupStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, ...extra } = req.body;

    const updated = await databaseService.updatePickupStatus(id, status, extra);
    if (!updated) {
      return errorResponse(res, 'NOT_FOUND', `Pickup request #${id} not found.`, 404);
    }

    return successResponse(res, updated, `Pickup request #${id} updated to "${status}".`);
  } catch (err) {
    next(err);
  }
};

export const deletePickup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await databaseService.deletePickup(id);

    if (!deleted) {
      return errorResponse(res, 'NOT_FOUND', `Pickup request #${id} not found.`, 404);
    }

    return successResponse(res, { id, deleted: true }, `Pickup request #${id} deleted successfully.`);
  } catch (err) {
    next(err);
  }
};

