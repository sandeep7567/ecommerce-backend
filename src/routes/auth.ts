import express, { RequestHandler } from "express";
import { AuthController } from "../controllers/AuthController";

import registerValidator from "../validators/registerValidator";

import { TokenService } from "../services/tokenService";
import { UserService } from "../services/userService";
import { CredentialService } from "./../services/credentialService";
import logger from "../config/logger";

import { asyncHandler } from "../middlewares/asyncHandler";
import loginValidator from "../validators/loginValidator";
import authenticator from "../middlewares/authenticator";
import validateRefreshToken from "../middlewares/validateRefreshToken";
import parseRefreshToken from "../middlewares/parseRefreshToken";
import { canAccess } from "../middlewares/canAccess";
import { Roles } from "../constants";

const router = express.Router();

const tokenService = new TokenService();
const userService = new UserService();
const credentialService = new CredentialService();
const authController = new AuthController(
    userService,
    tokenService,
    credentialService,
    logger,
);

router.post(
    "/register",
    registerValidator,
    asyncHandler(authController.register),
);

router.post("/login", loginValidator, asyncHandler(authController.login));

// customer only access routes
router.get("/self", authenticator, asyncHandler(authController.self));

// admin only access routes
router.get(
    "/self/admin",
    authenticator,
    canAccess([Roles.ADMIN]),
    asyncHandler(authController.self),
);

router.get(
    "/refresh",
    validateRefreshToken,
    asyncHandler(authController.refresh),
);

router.post(
    "/logout",
    authenticator,
    parseRefreshToken,
    asyncHandler(authController.logout),
);

export default router;
