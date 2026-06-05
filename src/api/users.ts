import { Response, Request } from "express";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { hashPassword } from "../auth.js";


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