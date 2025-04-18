CREATE TABLE "parcels" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "parcels_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"store" text NOT NULL,
	"received" boolean DEFAULT false NOT NULL,
	"email_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "email_id_idx" ON "parcels" USING btree ("email_id");