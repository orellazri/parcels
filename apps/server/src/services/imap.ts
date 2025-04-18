import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";

export type EmailMessage = {
  emailId: string;
  subject: string;
  from: string;
  body?: string;
};

export class ImapService {
  private static instance: ImapService | null = null;

  private constructor() {}

  public static getInstance(): ImapService {
    if (!ImapService.instance) {
      ImapService.instance = new ImapService();
    }
    return ImapService.instance;
  }

  private createClient(): ImapFlow {
    return new ImapFlow({
      host: "imap.gmail.com",
      port: 993,
      secure: true,
      auth: {
        user: process.env.EMAIL_ADDRESS!,
        pass: process.env.EMAIL_PASSWORD!,
      },
      logger: {
        debug: (obj: object) => {}, // eslint-disable-line @typescript-eslint/no-unused-vars
        info: (obj: object) => {
          console.log(obj);
        },
        warn: (obj: object) => {
          console.warn(obj);
        },
        error: (obj: object) => {
          console.error(obj);
        },
      },
    });
  }

  public async listMessages(): Promise<EmailMessage[]> {
    const client = this.createClient();
    await client.connect();
    try {
      await client.mailboxOpen(process.env.EMAIL_MAILBOX ?? "Parcels");
      const messages = await client.fetchAll("1:*", { uid: true, envelope: true });

      return messages.map((message) => ({
        emailId: message.emailId,
        subject: message.envelope.subject,
        from: message.envelope.from[0].address!,
      }));
    } finally {
      await client.logout();
    }
  }

  public async getMessage(emailId: string): Promise<EmailMessage> {
    const client = this.createClient();
    await client.connect();
    try {
      await client.mailboxOpen(process.env.EMAIL_MAILBOX ?? "Parcels");

      const uids = await client.search({ emailId });
      if (uids.length !== 1) {
        throw new Error(`Expected 1 email with ID ${emailId}, but got ${uids.length}`);
      }

      const uid = uids[0].toString();
      const message = await client.fetchOne(uid, { uid: true, envelope: true, source: true });

      return {
        emailId: message.emailId,
        subject: message.envelope.subject,
        from: message.envelope.from[0].address!,
        body: await simpleParser(message.source).then(
          (parsed) => parsed.html || parsed.textAsHtml || parsed.text || undefined,
        ),
      };
    } finally {
      await client.logout();
    }
  }
}
