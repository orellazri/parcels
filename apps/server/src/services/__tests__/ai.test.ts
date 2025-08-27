import "dotenv/config";
import assert from "node:assert";
import { describe, it } from "node:test";
import { extractDetailsFromEmail } from "../ai";
import type { EmailMessage } from "../imap";

describe("AI Service", () => {
  describe("extractDetailsFromEmail", () => {
    it("should extract product name and store from Amazon shipping email", async () => {
      const dummyEmail: EmailMessage = {
        emailId: "test-123",
        subject: "Your order has been shipped!",
        from: "noreply@amazon.com",
        body: `
          <html>
            <body>
              <h1>Your Amazon.com order has been shipped</h1>
              <p>Dear Customer,</p>
              <p>Great news! Your order has been shipped and is on its way.</p>
              
              <div>
                <h2>Order Details:</h2>
                <ul>
                  <li>Product: Apple iPhone 15 Pro Max 256GB - Natural Titanium</li>
                  <li>Quantity: 1</li>
                  <li>Order #: 123-4567890-1234567</li>
                </ul>
              </div>
              
              <p>Track your package: <a href="#">Click here</a></p>
              
              <p>Thanks for shopping with Amazon!</p>
            </body>
          </html>
        `,
      };

      const result = await extractDetailsFromEmail(dummyEmail);

      assert.ok(result, "Should return a result object");
      assert.ok(result.name, "Should extract product name");
      assert.ok(result.store, "Should extract store name");

      // Verify product name contains iPhone (should be shortened from the long description)
      assert.ok(
        result.name.toLowerCase().includes("iphone"),
        `Product name should contain "iphone", got: ${result.name}`,
      );

      // Verify store is Amazon (should prefer official name)
      assert.ok(result.store.toLowerCase().includes("amazon"), `Store should be Amazon, got: ${result.store}`);
    });

    it("should return null values for email with no body", async () => {
      const emailWithoutBody: EmailMessage = {
        emailId: "test-no-body",
        subject: "Test subject",
        from: "test@example.com",
        body: undefined,
      };

      const result = await extractDetailsFromEmail(emailWithoutBody);

      assert.strictEqual(result.name, null, "Should return null for product name when no body");
      assert.strictEqual(result.store, null, "Should return null for store when no body");
    });

    it("should return null values for email with empty body", async () => {
      const emailWithEmptyBody: EmailMessage = {
        emailId: "test-empty-body",
        subject: "Test subject",
        from: "test@example.com",
        body: "",
      };

      const result = await extractDetailsFromEmail(emailWithEmptyBody);

      assert.strictEqual(result.name, null, "Should return null for product name when empty body");
      assert.strictEqual(result.store, null, "Should return null for store when empty body");
    });

    it("should handle non-purchase emails gracefully", async () => {
      const nonPurchaseEmail: EmailMessage = {
        emailId: "test-newsletter",
        subject: "Weekly Newsletter",
        from: "newsletter@example.com",
        body: `
          <html>
            <body>
              <h1>Weekly Newsletter</h1>
              <p>This is just a newsletter with no purchase information.</p>
              <p>Some random content about our company updates.</p>
            </body>
          </html>
        `,
      };

      const result = await extractDetailsFromEmail(nonPurchaseEmail);

      // Should not throw an error and should return an object
      assert.ok(result, "Should return a result object");
      assert.ok(typeof result.name === "string" || result.name === null, "Name should be string or null");
      assert.ok(typeof result.store === "string" || result.store === null, "Store should be string or null");
    });
  });
});
