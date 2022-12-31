import { NextFunction, Request, Response } from 'express';
import { instanceToInstance } from 'class-transformer';
import { ListUserService, CreateUserService, ShowUserService } from '../../../app';
import { container } from 'tsyringe';

class UsersController {
  public async index(request: Request, response: Response) {
    const listUser = container.resolve(ListUserService);

    const users = await listUser.execute();

    return response.json(instanceToInstance(users));
  }

  public async show(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;

    const showUser = container.resolve(ShowUserService);

    try {
      const user = await showUser.execute({ id });
      return response.json(user);
    } catch (error) {
      return next(error);
    }
  }

  public async create(request: Request, response: Response, next: NextFunction) {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);
    try {
      const user = await createUser.execute({ name, email, password });

      return response.json(user);
    } catch (error) {
      return next(error);
    }
  }
}

export default UsersController;
