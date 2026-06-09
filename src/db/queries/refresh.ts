import { eq, isNull, gt, and } from "drizzle-orm";
import { db } from "../index.js";
import { refreshTokens, users } from "../schema.js";


export async function saveRefreshToken(token: string, user_id: string) {
    const result = await db
        .insert(refreshTokens)
        .values({
            userId: user_id,
            token: token,
            expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // expires in 60 days
            revokedAt: null,
        })
        .returning();
    return result;
}

export async function getUserFromRefreshToken(token: string) {
    const [result] = await db
        .select({user: users})
        .from(refreshTokens)
        .innerJoin(users, eq(users.id, refreshTokens.userId))
        .where(and(
            eq(refreshTokens.token, token),
            isNull(refreshTokens.revokedAt),
            gt(refreshTokens.expiresAt, new Date()))
        )

    return result;
}