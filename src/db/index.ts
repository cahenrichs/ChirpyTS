import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema.js";
import { config } from "../config.js";
import pg from "pg";

const conn = new pg.Pool({
    connectionString: config.db.dbURL
});
export const db = drizzle(conn, { schema });