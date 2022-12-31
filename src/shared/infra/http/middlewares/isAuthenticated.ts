import AppError from '@shared/errors/AppError';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function isAuthenticated(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decodedToken = verify(token, 'secret');
    const { sub } = decodedToken as TokenPayload;
    request.user = { id: sub };
    return next();
  } catch (error) {
    throw new AppError('Invalid JWT token', 401);
  }
}
