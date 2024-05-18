import express from "express";
import { AuthController } from "../controllers/AuthController";

import registerValidator from "../validators/registerValidator";

import { TokenService } from "../services/tokenService";
import { UserService } from "../services/userService";
import { CredentialService } from "./../services/credentialService";
import logger from "../config/logger";

import { asyncHandler } from "../middlewares/asyncHandler";

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

export default router;
