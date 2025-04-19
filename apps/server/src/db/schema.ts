import { boolean, integer, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const parcelsTable = pgTable(
  "parcels",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    store: text().notNull(),
    received: boolean().notNull().default(false),
    emailId: text(),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (table) => [uniqueIndex("email_id_idx").on(table.emailId)],
);
