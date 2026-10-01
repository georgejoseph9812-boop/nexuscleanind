const ALLOWED_WASTE_TYPES = [
  'Wet',
  'Dry',
  'Recyclable',
  'E-Waste',
  'Bulk Waste',
  'Other'
];

export const validatePickupCreate = (data = {}) => {
  if (!data.wasteType || !ALLOWED_WASTE_TYPES.some((w) => w.toLowerCase() === data.wasteType.toLowerCase())) {
    return `Invalid waste type. Must be one of: ${ALLOWED_WASTE_TYPES.join(', ')}`;
  }
  if (!data.address || typeof data.address !== 'string' || data.address.trim().length === 0) {
    return 'Pickup address is required.';
  }
  if (!data.preferredDate) {
    return 'Preferred collection date is required.';
  }
  return null;
};
