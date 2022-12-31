import path from 'path';
import EmealAdapter from '@config/mail/EmailAdapter';
import AppError from '@shared/errors/AppError';
import { ISendForgotPasswordEmail } from '../domain/models/ISendForgotPasswordEmail';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { IUserTokensRepository } from '../domain/repositories/IUserTokensRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}
  public async execute({ email }: ISendForgotPasswordEmail): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('User does not exist');
    }
    const token = await this.userTokensRepository.generate(user.id);

    if (!token) {
      throw new AppError('Token does not exist');
    }

    const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views', 'forgot_password.hbs');
    const mailInfo = {
      to: {
        name: user.name,
        mail: user.email,
      },
      subject: 'Recuperación de contraseña',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token.token}`,
        },
      },
    };

    const emailAdapter = new EmealAdapter();
    await emailAdapter.sendMail(mailInfo);
  }
}

export default SendForgotPasswordEmailService;
