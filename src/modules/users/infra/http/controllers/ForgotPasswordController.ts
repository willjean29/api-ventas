import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { SendForgotPasswordEmailService } from '../../../app';

class ForgotPasswordController {
  public async create(request: Request, response: Response, next: NextFunction) {
    const { email } = request.body;

    const sendForgotPasswordEmail = container.resolve(SendForgotPasswordEmailService);

    try {
      await sendForgotPasswordEmail.execute({ email });

      return response.status(204).json();
    } catch (error) {
      return next(error);
    }
  }
}

export default ForgotPasswordController;
