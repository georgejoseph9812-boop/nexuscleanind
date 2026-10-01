export const generateComplaintId = (currentCount = 4) => {
  return `NC-${1045 + currentCount + 1}`;
};

export const generatePickupId = (currentCount = 4) => {
  return `PK-${2084 + currentCount + 1}`;
};

export const generateUserId = (role = 'citizen') => {
  const prefix = role.toUpperCase();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `USR-${prefix}-${rand}`;
};

export const generateNotificationId = () => {
  return `NOTIF-${Date.now().toString().slice(-6)}`;
};
