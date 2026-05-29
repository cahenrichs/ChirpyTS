import { Response, Request } from "express";
import { respondWithError, respondWithJSON } from "./json.js";

export async function handlerChirpsValidate(req: Request, res: Response) {
   let body = ""; 

   req.on("data", (chunk) => {
    body += chunk;
   });

   req.on("end", () => {
    try {
        const parsedBody = JSON.parse(body);
        const len = parsedBody.body.length
        if (len > 140) {
          respondWithError(res, 400,"Chirp is too long")
          return;
        }
        respondWithJSON(res, 200, {valid: true})
    } catch (error) {
        res.status(400).send("Invalid JSON")
    }
   })
}


/*async function handler(req: Request, res: Response) {
  let body = ""; // 1. Initialize

  // 2. Listen for data events
  req.on("data", (chunk) => {
    body += chunk;
  });

  // 3. Listen for end events
  req.on("end", () => {
    try {
      const parsedBody = JSON.parse(body);
      // now you can use `parsedBody` as a JavaScript object
      // ...
    } catch (error) {
      res.status(400).send("Invalid JSON");
    }
  });
} */

  