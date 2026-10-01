import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { errorResponse } from './utils/apiResponse.js';

const app = express();

// Trust reverse proxy for hosting platforms (Render, Railway, Fly.io, Cloudflare)
app.set('trust proxy', 1);

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// Production Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again after 15 minutes.'
    }
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit login/register attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts. Please try again after 15 minutes.'
    }
  }
});

// CORS configuration supporting Vite dev server & production frontend domains
const configuredOrigins = (config.frontendUrl || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  ...configuredOrigins
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Check explicit allowed origins or wildcard subdomains
      const isAllowed = allowedOrigins.some((allowed) => {
        if (allowed === origin) return true;
        if (allowed.startsWith('*.')) {
          const rootDomain = allowed.slice(2);
          return origin.endsWith(rootDomain);
        }
        return false;
      });

      if (isAllowed || config.nodeEnv !== 'production') {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS policy.`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parsers with generous limits for photo uploads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Logging configuration
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

// Static file serving for uploads
app.use('/uploads', express.static(path.resolve('uploads')));

// Root health check for cloud load balancers and container probes
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'nexus-clean-backend',
    version: '1.0.0'
  });
});

// Apply rate limiting
app.use('/api', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Mount API routes
app.use('/api', apiRouter);

// 404 Handler for undefined API routes
app.use((req, res) => {
  errorResponse(
    res,
    'ROUTE_NOT_FOUND',
    `Cannot ${req.method} ${req.originalUrl}. Route does not exist on Nexus Clean API.`,
    404
  );
});

// Centralized Error Handler (sanitizes stack traces in production)
app.use(errorHandler);

export default app;
