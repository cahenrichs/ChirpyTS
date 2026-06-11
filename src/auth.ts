import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { BadRequestError, Unauthorized } from "./api/errors.js";
import crypto from "crypto";


export async function hashPassword(password: string): Promise<string> {
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

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

    let iat = Math.floor(Date.now() / 1000);

    const jwtPayload: payload = {
        iss: "chirpy",
        sub: userID,
        iat: iat,
        exp: iat + expiresIn,
    };

    return jwt.sign(jwtPayload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
    let decoded: JwtPayload;
    try {
        decoded = jwt.verify(tokenString, secret) as JwtPayload;
    } catch (err) {
        console.error("Error verifying JWT:", err);
        throw new Error("Failed to verify JWT");
    }
        const userId = decoded.sub;
        if (typeof userId !== "string") {
            throw new Error("Invalid JWT payload: 'sub' claim is missing or not a string");
        }
        return userId;
}

export function getBearerToken(req: Request): string {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw new BadRequestError("Authorization header is missing");
    }
    const parts = authHeader.split(" ");

    if (!parts || parts.length !== 2 || parts[0] !== "Bearer") {
        throw new BadRequestError("Invalid Authorization header format. Expected 'Bearer <token>'");
    }

    return parts[1];
}

export function makeRefreshToken(): string {
    const random = crypto.randomBytes(32).toString("hex");
    return random;
}

export function getAPIKey(req: Request) {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw new Unauthorized("Authorization header is missing");
    }

    const parts = authHeader.trim().split(/\s+/);
    
    if (parts.length !== 2 || parts[0] !== "ApiKey") {
        throw new BadRequestError("Invalid auth header format")
    }

    return parts[1];
}