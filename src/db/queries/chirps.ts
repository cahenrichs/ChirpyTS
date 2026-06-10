import { NewChirp, chirps, users } from "../../db/schema.js";
import { db } from "../../db/index.js";
import { asc, eq } from "drizzle-orm";

export async function createChirp(chirp: NewChirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .returning();
        return result;
}

export async function getAllChirps() {
    const result = await db
        .select()
        .from(chirps)
        .orderBy(asc(chirps.createdAt));
    return result;
}

export async function getChirpById(chirpId: string) {
    const [result] = await db 
        .select()
        .from(chirps)
        .where(eq(chirps.id, chirpId));
    return result;
}

export async function deleteChirp(chirpID: string) {
    const [result] = await db 
        .delete(chirps)
        .where(eq(chirps.id, chirpID))
        .returning()
        return result
}