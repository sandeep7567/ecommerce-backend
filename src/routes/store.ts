import express from "express";

import logger from "../config/logger";
import { StoreController } from "../controllers/StoreController";
import { asyncHandler } from "../middlewares/asyncHandler";
import authenticator from "../middlewares/authenticator";
import { StoreService } from "../services/storeService";
import storeValidator from "../validators/storeValidator";
import { UserService } from "../services/userService";

const router = express.Router();

const storeService = new StoreService();
const userService = new UserService();
const storeController = new StoreController(storeService, userService, logger);

router.post(
    "/",
    authenticator,
    storeValidator,
    asyncHandler(storeController.create),
);

router.get("/", authenticator, asyncHandler(storeController.getAll));

router.patch("/:storeId", authenticator, asyncHandler(storeController.update));

router.delete(
    "/:storeId",
    authenticator,
    asyncHandler(storeController.destroy),
);

export default router;
