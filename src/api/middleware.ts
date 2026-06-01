import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { NotFoundError, BadRequestError, Unauthorized, Forbidden } from "./errors.js";
import { respondWithError } from "./json.js";

export function middlewareLogResponse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.on("finish", () => {
    const statusCode = res.statusCode;

    if (statusCode >= 300) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
    }
  });

  next();
}

export function middlewareMetricsInc(
  _: Request,
  __: Response,
  next: NextFunction,
) {
  config.fileserverHits++;
  next();
}

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof NotFoundError) {
    respondWithError(res, 404, err.message);
  } else if (err instanceof BadRequestError) {
    respondWithError(res, 400, err.message);
  } else if (err instanceof Unauthorized) {
    respondWithError(res, 401, err.message);
  } else if (err instanceof Forbidden) {
    respondWithError(res, 403, err.message);
  } else {
    res.status(500).send("Internal Server Error")
  }
}