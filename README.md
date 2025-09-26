# 📦 Parcels

Parcels automatically tracks your parcels by monitoring your email for shipping notifications. It uses AI to extract tracking information and provides a centralized dashboard for all your incoming packages.

It periodically checks your email for new parcels in a given mailbox, extracts the product information using an AI model via OpenRouter, and stores the data in a PostgreSQL database.

![Screenshot of the Parcels application dashboard showing tracked packages](assets/screenshot.png)

_**Note**: This application was only tested and verified to work with Gmail._

## Usage

### Environment variables

| Required | Name                 | Description                                                                                     | Example/Default value                                 |
| -------- | -------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Yes**  | DATABASE_URL         | PostgreSQL database URL                                                                         | postgresql://postgres:postgres@localhost:5432/parcels |
| **Yes**  | OPENROUTER_API_KEY   | OpenRouter API key                                                                              | sk-...                                                |
| **Yes**  | OPENROUTER_MODEL     | OpenRouter model to use                                                                         | meta-llama/llama-3.1-8b-instruct                      |
| **Yes**  | EMAIL_ADDRESS        | Email address to monitor                                                                        | you@example.com                                       |
| **Yes**  | EMAIL_PASSWORD       | Password for the email address (e.g. app password for Gmail)                                    |                                                       |
| **Yes**  | WEB_PASSWORD         | Password for the web interface to authenticate with API                                         |                                                       |
| No       | IMAP_HOST            | IMAP host for the email server                                                                  | imap.gmail.com                                        |
| No       | IMAP_PORT            | IMAP port for the email server                                                                  | 993                                                   |
| No       | MAILBOX              | Mailbox to monitor                                                                              | Parcels                                               |
| No       | EMAIL_TRASH_MAILBOX  | Mailbox to delete emails in when marked as received                                             | [Gmail]/Trash                                         |
| No       | EMAIL_MOVE_MAILBOX   | Mailbox to move emails to when marked as received                                               | Inbox                                                 |
| No       | REDACT_STRINGS       | Comma-separated list of strings to redact from the email content before sending to the AI model | My name,My address,My email                           |
| No       | TIMEZONE             | Your timezone                                                                                   | UTC                                                   |
| No       | REFRESH_PARCELS_CRON | cron expression to refresh parcels                                                              | 0 0 \*/3 \* \* \*                                     |
| No       | ENV                  | Environment the server is running in                                                            | production                                            |

### Running in Docker (Recommended)

```bash
docker run -d \
    -e ... \ # environment variables
    -p 3000:3000 \
    reaperberri/parcels
```

### Running locally

Start dependencies:

```bash
docker compose up -d
```

Navigate to `apps/server`, copy `.env.example` to `.env` and fill in the environment variables.

Migrate the database:

```bash
task migrate
```

Run the server:

```bash
task run:server
```

Run the frontend web app:

```bash
task run:web
```

Navigate to `http://localhost:5173` to view frontend.
