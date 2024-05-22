import { NextFunction, Request, Response } from "express";
import StoreModel from "../model/store";
import { AuthRequest } from "../types";
import createHttpError from "http-errors";

export const storeByUserIdCheck = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { storeId } = req.params;
        const storeByUserId = await StoreModel.findOne({
            _id: storeId,
            userId: (req as AuthRequest).auth.sub,
        });

        if (!storeByUserId) {
            return next(
                createHttpError(401, "Unathourized Permission denied!"),
            );
        }

        next();
    } catch (err) {
        next(err);
    }
};