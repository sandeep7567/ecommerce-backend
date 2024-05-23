import { NextFunction, Response, Request } from "express";
import { validationResult } from "express-validator";
import { Logger } from "winston";

// import { Roles } from "../constants";
import createHttpError from "http-errors";
import { CredentialService } from "../services/credentialService";
import { TokenService } from "../services/tokenService";
import { UserService } from "../services/userService";
import {
    AuthPayload,
    AuthRequest,
    CreateUserIRequest,
    LoginUserRequest,
    Roles,
} from "../types";

export class AuthController {
    constructor(
        private userService: UserService,
        private tokenService: TokenService,
        private credentialService: CredentialService,
        private logger: Logger,
    ) {}

    register = async (
        req: CreateUserIRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { email, firstName, lastName, password, role } = req.body;

        this.logger.debug("New request to login user", {
            email,
            firstName,
            lastName,
            password: "******",
        });

        const existingUser =
            await this.userService.findByEmailWithPassword(email);

        if (existingUser) {
            return next(createHttpError(400, "User already exists"));
        }

        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password: await this.credentialService.hashPassword(password),
                role: role ? role : Roles.CUSTOMER,
            });

            const payload: AuthPayload = {
                sub: String(user._id),
                role: user.role,
                store: !!user.storeId?.length ? String(user.storeId?.[0]) : "",
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            // Persist the refresh token;
            const newRefreshToken = await this.tokenService.persistRefreshToken(
                String(user._id),
            );

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken._id),
            });

            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, // 1hr
                httpOnly: true,
            });

            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
                httpOnly: true,
            });

            this.logger.info("User has been register!", {
                id: user.id,
            });

            res.status(201).json({ id: user.id });
        } catch (err) {
            next(err);
            return;
        }
    };

    login = async (
        req: LoginUserRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { email, password } = req.body;

        this.logger.debug("New request to login user", {
            email,
            password: "******",
        });

        try {
            const user = await this.userService.findByEmailWithPassword(email);

            if (!user) {
                const error = createHttpError(
                    400,
                    "Email or password does not match",
                );
                next(error);
                return;
            }

            // password match
            const passwordMatch = await this.credentialService.comparePassword(
                password,
                user?.password,
            );

            if (!passwordMatch) {
                const error = createHttpError(
                    400,
                    "Email or password does not match",
                );
                next(error);
                return;
            }

            const payload: AuthPayload = {
                sub: String(user.id),
                role: user.role,
                store: !!user.storeId?.length ? String(user.storeId?.[0]) : "",
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            // Persist the refresh token;
            const newRefreshToken = await this.tokenService.persistRefreshToken(
                String(user._id),
            );

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken._id),
            });

            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, // 1hr
                httpOnly: true,
            });

            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
                httpOnly: true,
            });

            this.logger.info("User has been login", { id: user.id });

            res.status(200).json({ id: user.id });
        } catch (err) {
            next(err);
            return;
        }
    };

    self = async (req: Request, res: Response) => {
        const userId = (req as AuthRequest).auth.sub;
        const user = await this.userService.findById(userId);
        res.json({ user });
    };

    refresh = async (req: Request, res: Response, next: NextFunction) => {
        const auth = (req as AuthRequest).auth;
        try {
            const payload: AuthPayload = {
                sub: auth.sub,
                role: auth.role,
                store: auth.store,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            const user = await this.userService.findById(auth.sub);

            if (!user) {
                const error = createHttpError(
                    400,
                    "User with the token could not find",
                );
                next(error);
                return;
            }

            // Persist the refresh token;
            const newRefreshToken = await this.tokenService.persistRefreshToken(
                String(user._id),
            );

            // Delete old refresh token
            await this.tokenService.deleteRefreshToken(String(auth.id));

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: newRefreshToken._id,
            });

            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, // 1hr
                httpOnly: true,
            });

            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
                httpOnly: true,
            });

            this.logger.info("User has been login", { id: user._id });

            res.status(200).json({ id: user.id });
        } catch (err) {
            next(err);
            return;
        }
    };

    logout = async (req: Request, res: Response, next: NextFunction) => {
        const { id, sub } = (req as AuthRequest).auth;
        try {
            await this.tokenService.deleteRefreshToken(String(id));
            this.logger.info("Refresh token has been deleted", {
                id: id,
            });
            this.logger.info("User has been logged out", { id: sub });

            res.clearCookie("refreshToken");
            res.clearCookie("accessToken");
            res.status(200).json({});
        } catch (err) {
            next(err);
            return;
        }
    };
}
