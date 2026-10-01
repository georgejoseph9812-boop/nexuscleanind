import { analyzeWaste as analyzeService, verifyResolution as verifyService } from '../services/geminiService.js';
import { successResponse } from '../utils/apiResponse.js';

export const analyzeWaste = async (req, res, next) => {
  try {
    const { category, description, photoUrl } = req.body;

    const result = await analyzeService({
      category: category || (req.body.imageFileOrCategory ? req.body.imageFileOrCategory : 'Overflowing Bin'),
      description,
      photoUrl,
      imageBuffer: req.file ? req.file.buffer : null,
      imageMimeType: req.file ? req.file.mimetype : null
    });

    return successResponse(res, result, 'Waste analysis completed.');
  } catch (err) {
    next(err);
  }
};

export const verifyResolution = async (req, res, next) => {
  try {
    const { complaintId, beforeImageUrl, afterImageUrl } = req.body;

    const result = await verifyService({
      complaintId,
      beforeImageUrl,
      afterImageUrl
    });

    return successResponse(res, result, 'Resolution verification completed.');
  } catch (err) {
    next(err);
  }
};
