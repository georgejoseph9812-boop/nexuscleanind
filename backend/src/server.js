import app from './app.js';
import { config } from './config/env.js';
import { isSupabaseConfigured } from './config/supabase.js';
import { isGeminiConfigured } from './services/geminiService.js';
import { logger } from './utils/logger.js';
import { databaseService } from './services/databaseService.js';

const HOST = process.env.HOST || '0.0.0.0';
const PORT = config.port;

const server = app.listen(PORT, HOST, async () => {
  if (isSupabaseConfigured()) {
    await databaseService.seedHotspots();
  }
  
  console.log('================================================================');
  console.log('       NEXUS CLEAN — PREDICTIVE WASTE INTELLIGENCE API          ');
  console.log('          "Don\'t Just Report Waste. Predict It."               ');
  console.log('================================================================');
  logger.success(`Server active at     : http://${HOST}:${PORT}`);
  logger.info(`Health check URI     : http://${HOST}:${PORT}/health`);
  logger.info(`API Health URI       : http://${HOST}:${PORT}/api/health`);
  logger.info(`Environment Mode     : ${config.nodeEnv}`);
  logger.info(`Frontend Origin(s)   : ${config.frontendUrl}`);
  logger.info(`Database Mode        : ${isSupabaseConfigured() ? 'Supabase PostgreSQL (Live)' : 'In-Memory Seed Mode (Demo Resilience)'}`);
  logger.info(`AI Vision Mode       : ${isGeminiConfigured() ? 'Google Gemini 3.5 Flash (Live)' : 'Prototype Intelligence (Graceful Fallback)'}`);
  console.log('----------------------------------------------------------------');
  console.log('Endpoints ready:');
  console.log('  Health     : GET /health, GET /api/health');
  console.log('  Auth       : POST /api/auth/register, POST /api/auth/login, GET /api/users/me');
  console.log('  Complaints : GET/POST /api/complaints, GET/PATCH /api/complaints/:id');
  console.log('  Pickups    : GET/POST /api/pickups, PATCH /api/pickups/:id/status');
  console.log('  Hotspots   : GET /api/hotspots, GET /api/hotspots/:id');
  console.log('  Analytics  : GET /api/analytics, GET /api/analytics/recurring-problems');
  console.log('  AI Vision  : POST /api/ai/analyze-waste, POST /api/ai/verify-resolution');
  console.log('  Eco Score  : GET /api/eco-score, POST /api/eco-score/activity');
  console.log('  Awareness  : GET /api/awareness, GET /api/awareness/quiz');
  console.log('  Admin      : GET /api/admin/dashboard, GET /api/admin/pickups/recommendations');
  console.log('================================================================');
});

// Graceful shutdown handling
const handleShutdown = (signal) => {
  logger.info(`Received ${signal}. Shutting down HTTP server gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed. Exiting process.');
    process.exit(0);
  });
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

export default server;
