import { Response, Request } from "express";
import { respondWithError, respondWithJSON } from "./json.js";

export async function handlerChirpsValidate(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;

  const badWords: string[] = ["kerfuffle","sharbert","fornax"]

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    throw Error("Chirp too long");
  }
  const newSplit = params.body.split(" ")
  for (let i = 0; i < newSplit.length; i++) {
    const words = newSplit[i]
    const lowered = words.toLowerCase()
    if (badWords.includes(lowered)){
      newSplit[i] = "****"
    }
  }
  const cleaned = newSplit.join(" ")
  respondWithJSON(res, 200, {
    cleanedBody: cleaned,
  });

}
