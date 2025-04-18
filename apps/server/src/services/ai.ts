import { EmailMessage } from "@/services/imap";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function extractDetailsFromEmail(email: EmailMessage): Promise<{
  name: string | null;
  store: string | null;
}> {
  if (!email.body) {
    return { name: null, store: null };
  }

  const redactStrings = (process.env.REDACT_STRINGS ?? "").split(",");
  if (redactStrings) {
    redactStrings.forEach((string) => {
      const stringToRedact = string.trim();
      email.body = email.body?.replace(new RegExp(stringToRedact, "gi"), "REDACTED");
    });
  }

  const completion = await openai.chat.completions.create({
    model: process.env.OPENROUTER_MODEL!,
    messages: [
      {
        role: "system",
        content:
          'You will be given the HTML contents of an email message of a product that the user has purchased in the following format: From: <from>\nSubject: <subject>\n\n<content>. Extract the product name and store name from the following text. You must return a JSON object with the format {"name": "product name", "store": null}. If you don\'t find any product name or a store name, return {"name": null, "store": null} respectively. If you find more than one product name, return the product names joined by a comma - for example {"name": "product name 1, product name 2", "store": "store name"}. Only return the JSON object, nothing else. Do not return the json inside ```json or ```, only return the json object, so your output must be like this: {"name": "product name", "store": "store name"}. Your output must be be a valid JSON object. Do not end your output with a period. Do not return any other text than the JSON object, not even your reasoning.',
      },
      {
        role: "user",
        content: `From: ${email.from}\nSubject: ${email.subject}\n\n${email.body}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  console.info("AI Response", completion.choices[0].message);

  try {
    const content = completion.choices[0].message.content;
    if (content) {
      const result = JSON.parse(content);
      return { name: result.name, store: result.store };
    }
    return { name: null, store: null };
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return { name: null, store: null };
  }
}
