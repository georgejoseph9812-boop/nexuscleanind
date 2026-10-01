import { calculateHotspots, getHotspotAnalysis, regenerateForecast as forecastService } from '../services/predictionService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getHotspots = async (req, res, next) => {
  try {
    const hotspots = await calculateHotspots();
    return successResponse(res, hotspots, 'Predictive hotspots retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

export const getHotspotById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const analysis = await getHotspotAnalysis(id);

    if (!analysis) {
      return errorResponse(res, 'NOT_FOUND', `Hotspot intelligence record #${id} not found.`, 404);
    }

    return successResponse(res, analysis, 'Hotspot analysis retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

export const regenerateForecast = async (req, res, next) => {
  try {
    const result = await forecastService();
    return successResponse(res, result.hotspots, 'Forecast regenerated successfully.', 200, {
      timestamp: result.timestamp
    });
  } catch (err) {
    next(err);
  }
};
