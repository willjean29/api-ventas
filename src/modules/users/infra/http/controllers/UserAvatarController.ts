import { NextFunction, Request, Response } from 'express';
import { instanceToInstance } from 'class-transformer';
import { UpdateUserAvatarService } from '../../../app';
import { container } from 'tsyringe';

class UserAvatarController {
  public async update(request: Request, response: Response, next: NextFunction) {
    const updateAvatar = container.resolve(UpdateUserAvatarService);
    try {
      const user = await updateAvatar.execute({
        user_id: request.user.id,
        avatarFilename: request.file ? request.file.filename : '',
      });
      return response.json(instanceToInstance(user));
    } catch (error) {
      return next(error);
    }
  }
}

export default UserAvatarController;
