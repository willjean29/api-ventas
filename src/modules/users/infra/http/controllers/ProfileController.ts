import { NextFunction, Request, Response } from 'express';
import { instanceToInstance } from 'class-transformer';
import { ShowProfileService, UpdateProfileService } from '../../../app';
import { container } from 'tsyringe';

class ProfileController {
  public async show(request: Request, response: Response, next: NextFunction) {
    const showProfile = container.resolve(ShowProfileService);
    const user_id = request.user.id;

    try {
      const user = await showProfile.execute({ user_id });
      return response.json(instanceToInstance(user));
    } catch (error) {
      return next(error);
    }
  }

  public async update(request: Request, response: Response, next: NextFunction) {
    const { name, email, password, old_password } = request.body;
    const updateProfile = container.resolve(UpdateProfileService);
    const user_id = request.user.id;

    try {
      const user = await updateProfile.execute({ user_id, name, email, password, old_password });
      return response.json(instanceToInstance(user));
    } catch (error) {
      return next(error);
    }
  }
}

export default ProfileController;
