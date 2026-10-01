import { databaseService } from './databaseService.js';

export const getUserEcoScore = async (userId = 'USR-CITIZEN-01') => {
  return await databaseService.getEcoScore(userId);
};

export const recordEcoActivity = async (userId, activity) => {
  return await databaseService.addEcoActivity(userId, activity);
};
