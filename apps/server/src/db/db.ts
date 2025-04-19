import { drizzle } from "drizzle-orm/node-postgres";
import { getConfig } from "../config/config";
import * as schema from "./schema";

export const db = drizzle({ connection: getConfig().databaseUrl, casing: "snake_case", schema });
