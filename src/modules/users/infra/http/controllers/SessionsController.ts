import { NextFunction, Request, Response } from 'express';
import { instanceToInstance } from 'class-transformer';
import { CreateSessionsService } from '../../../app';
import { container } from 'tsyringe';

class SessionsController {
  public async create(request: Request, response: Response, next: NextFunction) {
    const { email, password } = request.body;

    const createSession = container.resolve(CreateSessionsService);
    try {
      const user = await createSession.execute({ email, password });

      return response.json(instanceToInstance(user));
    } catch (error) {
      return next(error);
    }
  }
}

export default SessionsController;
