import { Response, Request } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { BadRequestError, NotFoundError, Unauthorized } from "./errors.js";
import { createChirp, getAllChirps, getChirpById } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

function validateChirps(body: string) {
  const badWords: string[] = ["kerfuffle","sharbert","fornax"]

  const maxChirpLength = 140;
  if (body.length > maxChirpLength) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }
  const newSplit = body.split(" ")
  for (let i = 0; i < newSplit.length; i++) {
    const words = newSplit[i]
    const lowered = words.toLowerCase()
    if (badWords.includes(lowered)){
      newSplit[i] = "****"
    }
  }
  const cleaned = newSplit.join(" ")
  return cleaned

}

export async function handlerChirps(req: Request, res: Response) {
   type parameters = {
    body: string;
  };

  const parms: parameters = req.body;

  const bearerToken = getBearerToken(req);

  let validToken: string;
  try{
  validToken = validateJWT(bearerToken, config.jwt.secret);
} catch {
  throw new Unauthorized("not a valid token")
}
  const cleanedBody = validateChirps(parms.body)

  const chirp = await createChirp({
    body: cleanedBody,
    userId: validToken
  });
  if (!chirp) {
   throw new Error("Failed to create chirp");
  };
  respondWithJSON(res, 201, chirp);
}

export async function handlerGetChirps(req: Request, res: Response) {
  const chirps = await getAllChirps();
  respondWithJSON(res, 200, chirps);
}

export async function handlerGetChirpsById(req: Request, res: Response) {
  const chirpId = req.params.chirpId;
  if (typeof chirpId !== "string") {
    respondWithError(res, 400, "Invalid chirp ID");
    return;
  }
  const chirp = await getChirpById(chirpId);
  if (!chirp) {
    respondWithError(res, 404, "Chirp not found");
    return;
  }
  respondWithJSON(res, 200, chirp);
}
