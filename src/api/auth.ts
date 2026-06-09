import { getBearerToken, makeJWT } from "../auth.js";
import { config } from "../config.js";
import { Request, Response } from "express";
import { getUserFromRefreshToken, saveRefreshToken } from "../db/queries/refresh.js";
import { respondWithJSON } from "./json.js";
import { Unauthorized } from "./errors.js";



export async function handlerRefresh(req: Request, res: Response) {
      const bearerToken = getBearerToken(req);

      const getUser = await getUserFromRefreshToken(bearerToken)
    
      if (!getUser) {
        throw new Unauthorized("No User")
      }

      const user = getUser.user

        const token = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret);
      
      respondWithJSON(res, 200, 
        {
            "token": token
        }
      )
}