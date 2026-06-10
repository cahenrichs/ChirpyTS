import { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { respondWithError, respondWithJSON } from "./json.js";
import { checkPasswordHash } from "../auth.js";
import { makeJWT, makeRefreshToken } from "../auth.js";
import { config } from "../config.js";
import { saveRefreshToken } from "../db/queries/refresh.js";

export async function handlerLogin(req: Request, res: Response) {
    type parameters = {
        password: string;
        email: string;
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

        const token = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret);

        const refreshToken = makeRefreshToken();

        const saveResult = await saveRefreshToken(refreshToken, user.id);
        if (!saveResult) {
            respondWithError(res, 500, "Failed to save refresh token");
            return;
        }

        respondWithJSON(res, 200 , {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            token: token,
            refreshToken: refreshToken,
            isChirpyRed: user.isChirpyRed
        })
    } catch (error) {
        respondWithError(res, 401, "internal server error");
    }
}