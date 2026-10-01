const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegister = (data = {}) => {
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    return 'Full name is required.';
  }
  if (!data.email || !emailRegex.test(data.email)) {
    return 'A valid email address is required.';
  }
  if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
    return 'Password must be at least 6 characters in length.';
  }
  return null;
};

export const validateLogin = (data = {}) => {
  if (!data.email || !emailRegex.test(data.email)) {
    return 'A valid email address is required.';
  }
  if (!data.password || typeof data.password !== 'string' || data.password.length === 0) {
    return 'Password is required.';
  }
  return null;
};
