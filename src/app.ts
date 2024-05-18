import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";

import authRouter from "./routes/auth";
import { Config } from "./config";

const app = express();

app.use(
    cors({
        origin: [Config.ORIGIN_URI!],
        credentials: true,
    }),
);
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.use("/api/v1/auth", authRouter);

app.use(globalErrorHandler);

export default app;
