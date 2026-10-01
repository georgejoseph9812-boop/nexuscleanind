import { databaseService } from '../services/databaseService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getComplaints = async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
      category: req.query.category,
      area: req.query.area,
      search: req.query.search,
      userId: req.query.userId
    };

    const complaints = await databaseService.getComplaints(filters);
    return successResponse(res, complaints, 'Complaints retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

export const getComplaintById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const complaint = await databaseService.getComplaintById(id);

    if (!complaint) {
      return errorResponse(res, 'NOT_FOUND', `Complaint with reference ID #${id} not found.`, 404);
    }

    return successResponse(res, complaint, 'Complaint details retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

export const createComplaint = async (req, res, next) => {
  try {
    const {
      category,
      description,
      address,
      area,
      latitude,
      longitude,
      priority,
      photoUrl,
      aiAnalysis
    } = req.body;

    let finalBeforeImage = photoUrl || req.body.beforeImage;
    if (req.file) {
      finalBeforeImage = `/uploads/${req.file.filename}`;
    }

    const complaintData = {
      userId: req.user ? req.user.id : 'USR-CITIZEN-01',
      title: `${category} at ${area || 'Neighborhood'}`,
      category,
      description,
      address,
      area,
      coordinates: {
        lat: latitude ? parseFloat(latitude) : 26.4725,
        lng: longitude ? parseFloat(longitude) : 80.3412
      },
      priority: priority || 'High',
      photoUrl: finalBeforeImage,
      aiAnalysis
    };

    const newComplaint = await databaseService.createComplaint(complaintData);
    return successResponse(res, newComplaint, 'Complaint registered successfully.', 201);
  } catch (err) {
    next(err);
  }
};

export const updateComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await databaseService.updateComplaint(id, req.body);

    if (!updated) {
      return errorResponse(res, 'NOT_FOUND', `Complaint #${id} not found.`, 404);
    }

    return successResponse(res, updated, `Complaint #${id} updated successfully.`);
  } catch (err) {
    next(err);
  }
};

export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, ...additionalData } = req.body;

    let finalAfterImage = additionalData.afterImage;
    if (req.file) {
      finalAfterImage = `/uploads/${req.file.filename}`;
      additionalData.afterImage = finalAfterImage;
    }

    const updated = await databaseService.updateComplaintStatus(id, status, additionalData);

    if (!updated) {
      return errorResponse(res, 'NOT_FOUND', `Complaint #${id} not found.`, 404);
    }

    return successResponse(res, updated, `Complaint #${id} status updated to "${status}".`);
  } catch (err) {
    next(err);
  }
};

export const deleteComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await databaseService.deleteComplaint(id);

    if (!deleted) {
      return errorResponse(res, 'NOT_FOUND', `Complaint #${id} not found.`, 404);
    }

    return successResponse(res, { id, deleted: true }, `Complaint #${id} deleted successfully.`);
  } catch (err) {
    next(err);
  }
};

