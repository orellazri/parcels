# 📦 Parcels

Parcels automatically tracks your parcels by monitoring your email for shipping notifications. It uses AI to extract tracking information and provides a centralized dashboard for all your incoming packages.

It periodically checks your email for new parcels in a given mailbox, extracts the product information using an AI model via OpenRouter, and stores the data in a PostgreSQL database.

![Screenshot of the Parcels application dashboard showing tracked packages](assets/screenshot.png)

## Usage

### Environment variables

| Required | Name                 | Description                                                                                       | Example/Default value                                 |
| -------- | -------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Yes**  | DATABASE_URL         | The database URL                                                                                  | postgresql://postgres:postgres@localhost:5432/parcels |
| **Yes**  | OPENROUTER_API_KEY   | The OpenRouter API key                                                                            | sk-...                                                |
| **Yes**  | OPENROUTER_MODEL     | The OpenRouter model to use                                                                       | meta-llama/llama-3.1-8b-instruct                      |
| **Yes**  | EMAIL_ADDRESS        | The email address to monitor                                                                      | you@example.com                                       |
| **Yes**  | EMAIL_PASSWORD       | The password for the email address (e.g. app password for Gmail)                                  |                                                       |
| No       | EMAIL_MAILBOX        | The mailbox to monitor                                                                            | Parcels                                               |
| No       | EMAIL_TRASH_MAILBOX  | The mailbox to move emails to when deleted                                                        | [Gmail]/Trash                                         |
| No       | REDACT_STRINGS       | A comma-separated list of strings to redact from the email content before sending to the AI model | My name,My address,My email                           |
| No       | TIMEZONE             | Your timezone                                                                                     | UTC                                                   |
| No       | REFRESH_PARCELS_CRON | The cron expression to refresh parcels                                                            | 0 0 \*/3 \* \* \*                                     |
| No       | ENV                  | The environment the server is running in                                                          | production                                            |

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
