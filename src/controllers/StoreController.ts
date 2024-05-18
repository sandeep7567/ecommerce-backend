import { NextFunction, raw, Response } from "express";
import { Logger } from "winston";

// import { Roles } from "../constants";
import { validationResult } from "express-validator";
import { StoreService } from "../services/storeService";
import { AuthRequest, CreateStoreRequest, StoreRequest } from "../types";
import createHttpError from "http-errors";

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
}
