import { NextFunction, raw, Response } from "express";
import { Logger } from "winston";

// import { Roles } from "../constants";
import { validationResult } from "express-validator";
import { StoreService } from "../services/storeService";
import {
    AuthRequest,
    CreateStoreRequest,
    StoreI,
    StoreRequest,
} from "../types";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export class StoreController {
    constructor(
        private storeService: StoreService,
        private logger: Logger,
    ) {}

    create = async (
        req: CreateStoreRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const auth = (req as AuthRequest).auth;

        try {
            const store = await this.storeService.create({
                ...req.body,
                userId: auth.sub,
            });

            this.logger.info("Store created", { id: store._id });

            res.status(200).json({ storeId: store._id });
        } catch (err) {
            next(err);
            return;
        }
    };

    getAll = async (req: StoreRequest, res: Response, next: NextFunction) => {
        const authReq = req as AuthRequest;

        const { sub } = authReq.auth;

        try {
            const store = await this.storeService.getByUserId(sub);

            if (!store) {
                next(createHttpError(404, "Store not found"));
                return;
            }

            return res.json({ store });
        } catch (error) {
            next(createHttpError(500, "Internal error"));
        }
    };

    update = async (
        req: CreateStoreRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { sub } = (req as AuthRequest).auth;
        const { storeId } = req.params;

        try {
            const store: Pick<StoreI, "_id" | "name" | "userId"> = {
                name: req.body.name,
                _id: new mongoose.Types.ObjectId(storeId),
                userId: new mongoose.Types.ObjectId(sub),
            };

            const updateStore = await this.storeService.updateById(store);

            this.logger.info(`Update store ${store}`, { id: updateStore?._id });

            res.json({ id: updateStore?._id });
        } catch (err) {
            next(err);
            return;
        }
    };
}
