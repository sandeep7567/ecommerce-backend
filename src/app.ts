import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";

import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import storeRouter from "./routes/store";
import productRouter from "./routes/product";
import orderRouter from "./routes/order";

import { Config } from "./config";

const app = express();

app.use(
    cors({
        origin: [Config.ORIGIN_URI1!, Config.ORIGIN_URI2!],
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
app.use("/api/v1/user", userRouter);
app.use("/api/v1/store", storeRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);

app.use(globalErrorHandler);

export default app;
