import { IEmailAdapter, ISendMail } from './EmailInterface';
import mailConfig from './mail';
import EtherealMail from '@config/mail/EtherealMail';
import SESMail from '@config/mail/SESMail';

class EmailAdapter {
  private emailAdapter: IEmailAdapter;
  constructor() {
    this.emailAdapter = this.selectAdapterEmail();
  }

  async sendMail(data: ISendMail): Promise<void> {
    await this.emailAdapter.sendMail(data);
  }

  selectAdapterEmail() {
    switch (mailConfig.driver) {
      case 'ses':
        return new SESMail();

      default:
        return new EtherealMail();
    }
  }
}

export default EmailAdapter;
