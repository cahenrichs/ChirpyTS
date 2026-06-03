import type { Request, Response } from "express";
import { config } from "../config.js";
import { deleteUsersTBL } from "../db/queries/users.js";

export async function handlerReset(req: Request, res: Response) {
  if (config.api.platform !== "dev") {
    res.status(403).send("Forbidden");
    return;
  }
  config.api.fileserverHits = 0;
  await deleteUsersTBL();
  res.write("Hits reset to 0");
  res.end();
}