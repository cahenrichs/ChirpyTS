import { db } from "../index.js";
import { refreshTokens } from "../schema.js";

export async function saveRefreshToken(token: string, user_id: string) {
    const result = await db
        .insert(refreshTokens)
        .values({
            user_id: user_id,
            token: token,
            expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // expires in 60 days
            revoked_at: null,
        })
        .returning();
    return result;
}