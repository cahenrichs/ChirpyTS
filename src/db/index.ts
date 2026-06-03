import { drizzle } from "drizzle-orm/node-postgres";
import postgres from "postgres";

import * as schema from "./schema.js";
import { config } from "../config.js";

const conn = postgres(config.db.dbURL);
export const db = drizzle(conn, { schema });