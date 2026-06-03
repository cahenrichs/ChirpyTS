import { Response, Request } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { BadRequestError, NotFoundError } from "./errors.js";

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

  const cleanedBody = validateChirps(parms.body)
  
  respondWithJSON(res, 201, {
    body: cleanedBody,
  });
}
