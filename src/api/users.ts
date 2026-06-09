import { Response, Request } from "express";
import { createUser, updateUserDetails } from "../db/queries/users.js";
import { BadRequestError, Unauthorized } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { hashPassword, validateJWT } from "../auth.js";
import { getBearerToken } from "../auth.js";
import { config } from "../config.js";


export async function handlerUsers(req: Request, res: Response) {
    type parameters = {
        password: string;
        email: string;
    };

    const params: parameters = req.body;

    if (!params.email) {
        throw new BadRequestError("Email is required");
     }

    if (!params.password) {
        throw new BadRequestError("Password is required");
     }

     const hashedPassword = await hashPassword(params.password);

     const user = await createUser({
        email: params.email,
        hashedPassword: hashedPassword,
    });

    respondWithJSON(res, 201, {
        id: user.id,
        email: params.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    });
}

export async function handlerUpdateUser(req: Request, res: Response) {
    type parameters = {
        email: string,
        password: string
    }

    const params: parameters = req.body;

    if (!params.email) {
        throw new BadRequestError("Email is required");
     }

    if (!params.password) {
        throw new BadRequestError("Password is required");
     }
     try {
    const bearerToken = getBearerToken(req);

    const validToken = validateJWT(bearerToken, config.jwt.secret )

    const hashedPassword = await hashPassword(params.password)

    const updateUser = await updateUserDetails(validToken, params.email, hashedPassword)

    respondWithJSON(res, 200, {
        id: updateUser.id,
        email: params.email,
        createdAt: updateUser.createdAt,
        updatedAt: updateUser.updatedAt,
    })

     } catch {
        throw new Unauthorized("Invalid token")
     }
    
}