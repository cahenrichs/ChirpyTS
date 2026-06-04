import { NewChirp, chirps } from "../../db/schema.js";
import { db } from "../../db/index.js";

export async function createChirp(chirp: NewChirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .returning();
        return result;
}