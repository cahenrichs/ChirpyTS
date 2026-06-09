import { revokeRefreshToken } from "../db/queries/refresh.js"
import { getBearerToken } from "../auth.js";
import { Request, Response } from "express";


export async function handlerRevoke(req: Request, res: Response) {
    const bearerToken = getBearerToken(req);

    const revoke = revokeRefreshToken(bearerToken)

    res.status(204).end();

}