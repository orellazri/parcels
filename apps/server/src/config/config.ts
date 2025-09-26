type Config = {
  databaseUrl: string;
  openRouterApiKey: string;
  openRouterModel: string;
  emailAddress: string;
  emailPassword: string;
  webPassword: string;
  imapHost: string;
  imapPort: number;
  emailMailbox: string;
  emailTrashMailbox: string;
  emailMoveMailbox: string;
  redactStrings: string[];
  timezone: string;
  refreshParcelsCron: string;
  env: string;
};

let instance: Config | null = null;

function initializeConfig(): Config {
  return {
    databaseUrl: process.env.DATABASE_URL!,
    openRouterApiKey: process.env.OPENROUTER_API_KEY!,
    openRouterModel: process.env.OPENROUTER_MODEL!,
    emailAddress: process.env.EMAIL_ADDRESS!,
    emailPassword: process.env.EMAIL_PASSWORD!,
    webPassword: process.env.WEB_PASSWORD!,
    imapHost: process.env.IMAP_HOST || "imap.gmail.com",
    imapPort: parseInt(process.env.IMAP_PORT || "993", 10),
    emailMailbox: process.env.EMAIL_MAILBOX || "Parcels",
    emailTrashMailbox: process.env.EMAIL_TRASH_MAILBOX || "[Gmail]/Trash",
    emailMoveMailbox: process.env.EMAIL_MOVE_MAILBOX || "Inbox",
    redactStrings: process.env.REDACT_STRINGS?.split(",") || [],
    timezone: process.env.TIMEZONE || "UTC",
    refreshParcelsCron: process.env.REFRESH_PARCELS_CRON || "0 0 */3 * * *",
    env: process.env.ENV || "production",
  };
}

export function getConfig(): Config {
  if (!instance) {
    instance = initializeConfig();
  }
  return instance;
}
