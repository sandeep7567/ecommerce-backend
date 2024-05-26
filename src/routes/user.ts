import express from "express";

import logger from "../config/logger";
import { UserService } from "../services/userService";

import { UserController } from "../controllers/UserController";
import { asyncHandler } from "../middlewares/asyncHandler";
import authenticator from "../middlewares/authenticator";
import { storeByUserIdCheck } from "../middlewares/storeByUserIdCheck";

const router = express.Router();

const userService = new UserService();

const userController = new UserController(userService, logger);

router.get(
    "/:storeId",
    authenticator,
    storeByUserIdCheck,
    asyncHandler(userController.getUsers),
);

export default router;
