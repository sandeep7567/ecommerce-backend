import { NextFunction, Request, Response } from "express";
import { Logger } from "winston";
import createHttpError from "http-errors";
import { CredentialService } from "../services/credentialService";
import { TokenService } from "../services/tokenService";
import { UserService } from "../services/userService";
import { AuthRequest } from "../types";

export class UserController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}

    getUsers = async (req: Request, res: Response, next: NextFunction) => {
        const { storeId } = req.params;

        if (!storeId || typeof storeId !== "string") {
            return next(createHttpError(400, "Store ID is required"));
        }

        this.logger.info("Getting users");
        const user = await this.userService.findByStoreId(storeId);
        res.json({ user });
    };
}
