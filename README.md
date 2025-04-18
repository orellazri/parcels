# Parcels

Parcels automatically tracks your parcels by monitoring your email for shipping notifications. It uses AI to extract tracking information and provides a centralized dashboard for all your incoming packages.

## Usage

### Environment variables

| Name                | Description                                                                                       | Example                                               |
| ------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| DATABASE_URL        | The database URL                                                                                  | postgresql://postgres:postgres@localhost:5432/parcels |
| OPENROUTER_API_KEY  | The OpenRouter API key                                                                            | sk-...                                                |
| OPENROUTER_MODEL    | The OpenRouter model to use                                                                       | meta-llama/llama-3.1-8b-instruct                      |
| EMAIL_ADDRESS       | The email address to monitor                                                                      | you@example.com                                       |
| EMAIL_PASSWORD      | The password for the email address (e.g. app password for Gmail)                                  |                                                       |
| EMAIL_MAILBOX       | The mailbox to monitor                                                                            | Parcels                                               |
| EMAIL_TRASH_MAILBOX | The mailbox to move emails to when deleted                                                        | [Gmail]/Trash                                         |
| REDACT_STRINGS      | A comma-separated list of strings to redact from the email content before sending to the AI model | My name,My address,My email                           |

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

Run the web app:

```bash
task run:web
```
