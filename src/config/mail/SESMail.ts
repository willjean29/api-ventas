import nodemailer from 'nodemailer';
import AWS from 'aws-sdk';
import HandlebarsMailTemplate from './HandlebarsMailTemplate';
import mailConfig from '@config/mail/mail';
import { IEmailAdapter, ISendMail } from './EmailInterface';

class SESMail implements IEmailAdapter {
  async sendMail({ to, from, subject, templateData }: ISendMail): Promise<void> {
    const mailTemplate = new HandlebarsMailTemplate();

    const transport = nodemailer.createTransport({
      SES: new AWS.SES({
        apiVersion: '2010-12-01',
      }),
    });

    const { name, email } = mailConfig.defaults.from;

    await transport.sendMail({
      from: {
        name: from?.name || name,
        address: from?.mail || email,
      },
      to: {
        name: to.name,
        address: to.mail,
      },
      subject,
      html: await mailTemplate.parse(templateData),
    });
  }
}

export default SESMail;
