import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_GENERAL_MAX = 100;
const RATE_LIMIT_AUTH_MAX = 10;

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

await redisClient.connect();

const getStore = () => new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args)
});

// General limiter
export const generalLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_GENERAL_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: true,
        message: 'Too many requests from this IP, please try again later.'
    },
    store: getStore()
});

// Auth limiter
export const authLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_AUTH_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: true,
        message: 'Too many authentication attempts, please try again later.'
    },
    skipSuccessfulRequests: false,
    store: getStore()
});