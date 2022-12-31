import { NextFunction, Request, Response } from 'express';
import { ResetPasswordService } from '../../../app';
import { container } from 'tsyringe';

class ResetPasswordController {
  public async create(request: Request, response: Response, next: NextFunction) {
    const { token, password } = request.body;

    const resetPassword = container.resolve(ResetPasswordService);

    try {
      await resetPassword.execute({ token, password });

      return response.status(204).json();
    } catch (error) {
      return next(error);
    }
  }
}

export default ResetPasswordController;
