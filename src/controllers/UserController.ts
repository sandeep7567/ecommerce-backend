import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { Logger } from "winston";
import { UserService } from "../services/userService";

export class UserController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}

    getUsers = async (req: Request, res: Response, next: NextFunction) => {
        const { storeId } = req.params;
        const pageIndex = Number(req.query.pageIndex) || 1;
        const pageSize = Number(req.query.pageSize) || 4;

        if (!storeId || typeof storeId !== "string") {
            return next(createHttpError(400, "Store ID is required"));
        }

        const users = await this.userService.findByStoreId({
            pageIndex,
            pageSize,
        });

        const totalDocs = await this.userService.userCount();

        const usersDocuments = {
            users: users,
            totalDocs,
            pageIndex: Number(pageIndex),
            pageSize: Number(pageSize),
            pageCount: Math.ceil(totalDocs / Number(pageSize)),
        };

        this.logger.info("Getting users");
        res.json({ ...usersDocuments });
    };
}
