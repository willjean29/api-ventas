import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import AppError from '@shared/errors/AppError';
import Redis from 'ioredis';
export default async function rateLimiter(request: Request, response: Response, next: NextFunction) {
  try {
    const redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASS || undefined,
    });

    const limiter = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: 'rateLimiter',
      points: 5,
      duration: 1,
    });

    await limiter.consume(request.ip);
    return next();
  } catch (error) {
    throw new AppError('Too many requests', 429);
  }
}
