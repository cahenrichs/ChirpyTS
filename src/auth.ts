import argon2 from "argon2";

export async function hashPassword(password: string): Promise<string> {
    const argon2 = require("argon2");
    try {
        const hash = await argon2.hash(password);
        return hash;
    } catch (err) {
        console.error("Error hashing password:", err);
        throw new Error("Failed to hash password");
    }
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    try {
        return await argon2.verify(hash, password);
    } catch (err) {
        console.error("Error checking password hash:", err);
        throw new Error("Failed to check password hash");
    }
}