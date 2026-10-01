export const logger = {
  info: (...args) => console.log(`[INFO ${new Date().toISOString().slice(11, 19)}]`, ...args),
  warn: (...args) => console.warn(`[WARN ${new Date().toISOString().slice(11, 19)}]`, ...args),
  error: (...args) => console.error(`[ERROR ${new Date().toISOString().slice(11, 19)}]`, ...args),
  success: (...args) => console.log(`[OK   ${new Date().toISOString().slice(11, 19)}]`, ...args)
};
