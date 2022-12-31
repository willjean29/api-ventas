import nodemailer from 'nodemailer';
import { IEmailAdapter, ISendMail } from './EmailInterface';
import HandlebarsMailTemplate from './HandlebarsMailTemplate';

class EtherealMail implements IEmailAdapter {
  async sendMail({ to, from, subject, templateData }: ISendMail): Promise<void> {
    const account = await nodemailer.createTestAccount();

    const mailTemplate = new HandlebarsMailTemplate();

    const transport = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    const message = await transport.sendMail({
      from: {
        name: from?.name || 'Equipo Api Ventas',
        address: from?.mail || 'equipo@ventas.com',
      },
      to: {
        name: to.name,
        address: to.mail,
      },
      subject,
      html: await mailTemplate.parse(templateData),
    });

    console.log('Message sent: %s', message.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

export default EtherealMail;
