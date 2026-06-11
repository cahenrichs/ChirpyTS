import { Request, Response } from "express"
import { upgradeToRed } from "../db/queries/users.js"
import {  NotFoundError, Unauthorized } from "./errors.js"
import { config } from "../config.js"
import { getAPIKey } from "../auth.js"

export async function handlerWebhooks(req: Request, res: Response) {
    type parameters = {
        event: string,
        data: {
            userId: string
        }
    }

    const authHeader = getAPIKey(req)

    if (authHeader !== config.api.polkaKey) {
        throw new Unauthorized("Not your chrip. You can not delete.")
    }

    const params: parameters = req.body

    if (params.event !== "user.upgraded") {
       return res.status(204).send()
    }

   const upgrade = await upgradeToRed(params.data.userId)
   if (!upgrade) {
    throw new NotFoundError("Can't find user")
   }

   return res.status(204).send()
}