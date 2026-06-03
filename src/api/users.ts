import { Response, Request } from "express";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "./errors.js";
import { respondWithJSON } from "./json.js";

export async function handlerUsers(req: Request, res: Response) {
    type parameters = {
        email: string;
    };

    const params: parameters = req.body;

    if (!params.email) {
        throw new BadRequestError("Email is required");
     }

    const user = await createUser({
        email: params.email,
    });

    respondWithJSON(res, 201, {
        id: user.id,
        email: params.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    });
}