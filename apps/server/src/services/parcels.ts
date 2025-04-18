import * as schema from "@/db/schema";
import { parcelsTable } from "@/db/schema";
import { extractDetailsFromEmail } from "@/services/ai";
import { ImapService } from "@/services/imap";
import { ListParcelsResponseDto, UpdateParcelRequestDto, UpdateParcelResponseDto } from "@parcels/common";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export async function listParcels(db: NodePgDatabase<typeof schema>): Promise<ListParcelsResponseDto> {
  const parcels = await db.query.parcelsTable.findMany();

  return parcels.map((parcel) => ({
    id: parcel.id,
    name: parcel.name,
    store: parcel.store,
    received: parcel.received,
    createdAt: parcel.createdAt,
  }));
}

export async function updateParcel(
  db: NodePgDatabase<typeof schema>,
  id: number,
  dto: UpdateParcelRequestDto,
): Promise<UpdateParcelResponseDto> {
  const updatedParcel = await db.update(parcelsTable).set(dto).where(eq(parcelsTable.id, id)).returning();

  if (dto.received) {
    const imapService = ImapService.getInstance();
    await imapService.moveMessage(updatedParcel[0].emailId, process.env.EMAIL_TRASH_MAILBOX ?? "[Gmail]/Trash");
  }

  return {
    id: updatedParcel[0].id,
    name: updatedParcel[0].name,
    store: updatedParcel[0].store,
    received: updatedParcel[0].received,
    createdAt: updatedParcel[0].createdAt,
  };
}

export async function deleteParcel(db: NodePgDatabase<typeof schema>, id: number) {
  await db.delete(parcelsTable).where(eq(parcelsTable.id, id));
}

export async function regenerateParcel(db: NodePgDatabase<typeof schema>, id: number) {
  const parcel = await db.query.parcelsTable.findFirst({
    where: eq(parcelsTable.id, id),
  });

  if (!parcel) {
    throw new Error("Parcel not found");
  }

  const imapService = ImapService.getInstance();
  const messageWithBody = await imapService.getMessage(parcel.emailId);
  const { name, store } = await extractDetailsFromEmail(messageWithBody);

  const updatedParcel = await db
    .update(parcelsTable)
    .set({
      name: name ?? messageWithBody.subject,
      store: store ?? messageWithBody.from,
    })
    .where(eq(parcelsTable.id, id))
    .returning();

  return {
    id: updatedParcel[0].id,
    name: updatedParcel[0].name,
    store: updatedParcel[0].store,
    received: updatedParcel[0].received,
    createdAt: updatedParcel[0].createdAt,
  };
}

export async function refreshParcels(db: NodePgDatabase<typeof schema>) {
  const imapService = ImapService.getInstance();
  const messages = await imapService.listMessages();

  const results = await Promise.all(
    messages.map(async (message) => {
      const existingParcel = await db.query.parcelsTable.findFirst({
        where: eq(parcelsTable.emailId, message.emailId),
      });

      if (existingParcel) {
        return false;
      }

      const messageWithBody = await imapService.getMessage(message.emailId);
      const { name, store } = await extractDetailsFromEmail(messageWithBody);

      await db.insert(parcelsTable).values({
        name: name ?? message.subject,
        emailId: message.emailId,
        store: store ?? message.from,
        received: false,
      });

      return true;
    }),
  );

  return results.filter(Boolean).length;
}
