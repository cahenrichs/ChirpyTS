import { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { respondWithError, respondWithJSON } from "./json.js";
import { checkPasswordHash } from "../auth.js";
import { makeJWT } from "../auth.js";

export async function handlerLogin(req: Request, res: Response) {
    type parameters = {
        password: string;
        email: string;
        expiresInSeconds?: number;
    };

    try {
        const params: parameters = req.body;

        const user = await getUserByEmail(params.email);

        if (!user) {
            respondWithError(res, 401, "incorrect email or password");
            return;
        }

        const passwordMatch = await checkPasswordHash(params.password, user.hashedPassword);
            if (!passwordMatch) {
            respondWithError(res, 401, "incorrect email or password");
            return;
        }

        let expiry = params.expiresInSeconds ?? 3600;
        if (expiry > 3600) {
        expiry = 3600;
        }

        const token = makeJWT(user.id, expiry, process.env.JWT_SECRET!);

        respondWithJSON(res, 200 , {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            token: token
        })
    } catch (error) {
        respondWithError(res, 401, "internal server error");
    }
}