import { db } from '../index.js';
import { NewUser, users } from '../schema.js';

export async function creatUser(user: NewUser) {
    const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
    return result;
}