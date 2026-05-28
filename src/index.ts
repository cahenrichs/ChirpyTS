import { handlerReset } from "./api/reset.js";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareMetricsInc, middlewareLogResponse } from "./api/middleware.js";
import { handlerMetrics } from "./api/metrics.js";
import express  from "express";

const app = express()
const PORT = 8080

app.use(middlewareLogResponse)
app.use("/app", middlewareMetricsInc, express.static("./src/app"));


app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics)
app.post("/admin/reset", handlerReset)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




