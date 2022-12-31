import express, { NextFunction, Request, Response } from 'express';
import 'reflect-metadata';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';
import 'dotenv/config';
import AppError from '@shared/errors/AppError';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';
import uploadConfig from '@config/upload';
import rateLimiter from '@shared/infra/http/middlewares/raterLimit';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(rateLimiter);
app.use('/files', express.static(uploadConfig.dest));

app.use(routes);
app.use(errors());

app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }
  console.log({ error });
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

app.listen(4000, () => {
  console.log('server is running on port 4000');
});
