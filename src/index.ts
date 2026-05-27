import express, { Request, Response, NextFunction } from "express";
import { config } from "./config.js"
import { nextTick } from "node:process";

const app = express()
const PORT = 8080

const handlerReadiness = (req: Request, res: Response) => {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send("OK");
};

type Middleware = (req: Request, res: Response, next: NextFunction) => void; 

export const middlewareLogResponses: Middleware = (req, res, next) => {
    res.on("finish", () => {
      const statusCode = res.statusCode;
      if (statusCode < 200 || statusCode >= 300) {
        console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`)
      };
});
next();
}

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    config.fileserverHits ++
    next();
}

export function numberofRequestResponse(req: Request, res: Response) {
    const count = config.fileserverHits
    res.set("Content-Type", "text/plain");
    res.send(`Hits: ${count}`)
}

export function resetFileserverHits(req: Request, res: Response, next: NextFunction) {
    config.fileserverHits = 0
    res.send("OK");
    next();
}

app.use(middlewareLogResponses)
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/api/healthz", middlewareMetricsInc, handlerReadiness);
app.get("/api/metrics", numberofRequestResponse)
app.get("/api/reset", resetFileserverHits)
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




