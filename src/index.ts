import { handlerReset } from "./api/reset.js";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareMetricsInc, middlewareLogResponse, errorMiddleware } from "./api/middleware.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerChirpsValidate } from "./api/chirps.js";
import { Request, Response, NextFunction } from "express";

import express  from "express";

const app = express()
const PORT = 8080

app.use(express.json());

app.use(middlewareLogResponse)
app.use("/app", middlewareMetricsInc, express.static("./src/app"));


app.get("/api/healthz", (req, res, next) => {
    Promise.resolve(handlerReadiness(req, res)).catch(next)
});
app.post("/api/validate_chirp", async (req, res, next) => {
    try {
        await handlerChirpsValidate(req, res);
    } catch (err) {
        next(err);
    }
})
app.get("/admin/metrics", (req, res, next) => {
    Promise.resolve(handlerMetrics(req, res)).catch(next)
})
app.post("/admin/reset", (req, res, next) => {
    Promise.resolve(handlerReset(req, res)).catch(next)
})

app.use(errorMiddleware)
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




