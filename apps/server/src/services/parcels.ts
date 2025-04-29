import {
  CreateParcelRequestDto,
  ListParcelsResponseDto,
  ParcelResponseDto,
  UpdateParcelRequestDto,
  UpdateParcelResponseDto,
} from "@parcels/common";
import { eq } from "drizzle-orm";
import { getConfig } from "../config/config";
import { db } from "../db/db";
import { parcelsTable } from "../db/schema";
import { extractDetailsFromEmail } from "../services/ai";
import { ImapService } from "../services/imap";

export async function listParcels(received: boolean): Promise<ListParcelsResponseDto> {
  // By default, we only show parcels that have not been received
  let parcels;
  if (received) {
    parcels = await db.query.parcelsTable.findMany();
  } else {
    parcels = await db.query.parcelsTable.findMany({
      where: eq(parcelsTable.received, false),
    });
  }

  return parcels.map((parcel) => ({
    id: parcel.id,
    name: parcel.name,
    store: parcel.store,
    received: parcel.received,
    emailId: parcel.emailId ?? undefined,
    note: parcel.note ?? undefined,
    createdAt: parcel.createdAt,
  }));
}

export async function createParcel(dto: CreateParcelRequestDto): Promise<ParcelResponseDto> {
  const [parcel] = await db
    .insert(parcelsTable)
    .values({
      name: dto.name,
      store: dto.store,
      received: false,
      note: dto.note,
    })
    .returning();

  return {
    id: parcel.id,
    name: parcel.name,
    store: parcel.store,
    received: parcel.received,
    emailId: parcel.emailId ?? undefined,
    note: parcel.note ?? undefined,
    createdAt: parcel.createdAt,
  };
}

export async function updateParcel(id: number, dto: UpdateParcelRequestDto): Promise<UpdateParcelResponseDto> {
  const [updatedParcel] = await db.update(parcelsTable).set(dto).where(eq(parcelsTable.id, id)).returning();

  if (dto.received && updatedParcel.emailId) {
    const imapService = ImapService.getInstance();
    imapService
      .moveMessage(updatedParcel.emailId, getConfig().emailTrashMailbox)
      .catch((error) => console.error(`Error moving message to trash: ${error}`));
  }

  return {
    id: updatedParcel.id,
    name: updatedParcel.name,
    store: updatedParcel.store,
    received: updatedParcel.received,
    emailId: updatedParcel.emailId ?? undefined,
    note: updatedParcel.note ?? undefined,
    createdAt: updatedParcel.createdAt,
  };
}

export async function deleteParcel(id: number) {
  await db.delete(parcelsTable).where(eq(parcelsTable.id, id));
}

export async function regenerateParcel(id: number) {
  const parcel = await db.query.parcelsTable.findFirst({
    where: eq(parcelsTable.id, id),
  });

  if (!parcel) {
    throw new Error("Parcel not found");
  }

  if (!parcel.emailId) {
    return {
      id: parcel.id,
      name: parcel.name,
      store: parcel.store,
      received: parcel.received,
      createdAt: parcel.createdAt,
    };
  }

  const imapService = ImapService.getInstance();
  const messageWithBody = await imapService.getMessage(parcel.emailId);
  const { name, store } = await extractDetailsFromEmail(messageWithBody);

  const [updatedParcel] = await db
    .update(parcelsTable)
    .set({
      name: name ?? messageWithBody.subject,
      store: store ?? messageWithBody.from,
    })
    .where(eq(parcelsTable.id, id))
    .returning();

  return {
    id: updatedParcel.id,
    name: updatedParcel.name,
    store: updatedParcel.store,
    received: updatedParcel.received,
    emailId: updatedParcel.emailId!,
    note: updatedParcel.note ?? undefined,
    createdAt: updatedParcel.createdAt,
  };
}

export async function refreshParcels() {
  const imapService = ImapService.getInstance();
  const messages = await imapService.listMessages();

  const MAX_CONCURRENCY = 5;
  const results: boolean[] = [];
  for (let i = 0; i < messages.length; i += MAX_CONCURRENCY) {
    const chunk = messages.slice(i, i + MAX_CONCURRENCY);
    const chunkResults = await Promise.all(
      chunk.map(async (message) => {
        const existingParcel = await db.query.parcelsTable.findFirst({
          where: eq(parcelsTable.emailId, message.emailId),
        });

        if (existingParcel) {
          return false;
        }

        // Fetch full message details only if it's a new parcel
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
    results.push(...chunkResults);
  }

  return results.filter(Boolean).length;
}
