import { Request, Response, NextFunction } from "express";

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BadRequestError";
    }
}

export class Unauthorized extends Error {
    constructor(message: string) {
        super(message);
        this.name = "Unauthorized"
    }
}

export class Forbidden extends Error {
    constructor(message: string) {
        super(message);
        this.name = "Forbidden"
    }
}
