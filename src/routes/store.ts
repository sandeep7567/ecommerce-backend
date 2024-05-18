import express from "express";

import logger from "../config/logger";
import { StoreController } from "../controllers/StoreController";
import { asyncHandler } from "../middlewares/asyncHandler";
import authenticator from "../middlewares/authenticator";
import { StoreService } from "../services/storeService";
import storeValidator from "../validators/storeValidator";

const router = express.Router();

const storeService = new StoreService();
const storeController = new StoreController(storeService, logger);

router.post(
    "/",
    authenticator,
    storeValidator,
    asyncHandler(storeController.create),
);

export default router;
