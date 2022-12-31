interface IMailContact {
  name: string;
  mail: string;
}

interface ITemplateVariable {
  [key: string]: string | number;
}

interface IParseTemplate {
  file: string;
  variables: ITemplateVariable;
}

export interface ISendMail {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateData: IParseTemplate;
}

export interface IEmailAdapter {
  sendMail(data: ISendMail): Promise<void>;
}
