import { handlerReset } from "./api/reset.js";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareMetricsInc, middlewareLogResponse, errorMiddleware } from "./api/middleware.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerChirps, handlerDeleteChirp, handlerGetChirps, handlerGetChirpsById } from "./api/chirps.js";
import { Request, Response, NextFunction } from "express";
import { handlerUpdateUser, handlerUsers } from "./api/users.js";
import { handlerLogin } from "./api/login.js";

import express  from "express";
import { handlerRefresh } from "./api/auth.js";
import { handlerRevoke } from "./api/revoke.js";
import { handlerWebhooks } from "./api/webhooks.js";

const app = express()
const PORT = 8080

app.use(express.json());

app.use(middlewareLogResponse)
app.use("/app", middlewareMetricsInc, express.static("./src/app"));


app.get("/api/healthz", (req, res, next) => {
    Promise.resolve(handlerReadiness(req, res)).catch(next)
});

app.get("/api/chirps/:chirpId", (req, res, next) => {
    Promise.resolve(handlerGetChirpsById(req, res)).catch(next)
} )

app.get("/api/chirps", (req, res, next) => {
    Promise.resolve(handlerGetChirps(req, res)).catch(next)
} )

app.post("/api/users", (req, res, next) => {
    Promise.resolve(handlerUsers(req, res)).catch(next)
} )

app.post("/api/chirps", (req, res, next) => {
    Promise.resolve(handlerChirps(req, res)).catch(next)
})

app.post("/api/login", (req, res, next) => {
    Promise.resolve(handlerLogin(req, res)).catch(next)
})

app.get("/admin/metrics", (req, res, next) => {
    Promise.resolve(handlerMetrics(req, res)).catch(next)
})
app.post("/admin/reset", (req, res, next) => {
    Promise.resolve(handlerReset(req, res)).catch(next)
})

app.post("/api/refresh", (req, res, next) => {
    Promise.resolve(handlerRefresh(req, res)).catch(next)
})

app.post("/api/revoke", (req,res, next) => {
    Promise.resolve(handlerRevoke(req, res)).catch(next)
})

app.put("/api/users", (req, res, next) => {
    Promise.resolve(handlerUpdateUser(req, res)).catch(next)
})

app.delete("/api/chirps/:chirpId", (req, res, next) => {
    Promise.resolve(handlerDeleteChirp(req, res)).catch(next)
})

app.post("/api/polka/webhooks", (req, res, next) => {
    Promise.resolve(handlerWebhooks(req, res)).catch(next)
})

app.use(errorMiddleware)
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




