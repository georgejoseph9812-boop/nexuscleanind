const ALLOWED_CATEGORIES = [
  'Overflowing Bin',
  'Roadside Garbage',
  'Illegal Dumping',
  'Missed Collection',
  'Improper Segregation',
  'Construction Waste',
  'Other'
];

const ALLOWED_PRIORITIES = ['low', 'medium', 'high', 'critical'];

const ALLOWED_STATUSES = [
  'pending',
  'assigned',
  'in progress',
  'resolution submitted',
  'resolved'
];

export const validateComplaintCreate = (data = {}) => {
  if (!data.category || !ALLOWED_CATEGORIES.some((c) => c.toLowerCase() === data.category.toLowerCase())) {
    return `Invalid complaint category. Must be one of: ${ALLOWED_CATEGORIES.join(', ')}`;
  }
  if (!data.address || typeof data.address !== 'string' || data.address.trim().length === 0) {
    return 'Street address is required.';
  }
  if (!data.area || typeof data.area !== 'string' || data.area.trim().length === 0) {
    return 'Neighborhood/Area is required.';
  }
  if (data.priority && !ALLOWED_PRIORITIES.includes(data.priority.toLowerCase())) {
    return 'Priority must be one of: Low, Medium, High, Critical';
  }
  return null;
};

export const validateComplaintStatus = (data = {}) => {
  if (!data.status || !ALLOWED_STATUSES.includes(data.status.toLowerCase())) {
    return 'Status must be one of: Pending, Assigned, In Progress, Resolution Submitted, Resolved';
  }
  return null;
};
