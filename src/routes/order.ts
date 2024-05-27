import express from "express";
import logger from "../config/logger";
import { OrderController } from "../controllers/OrderController";
import { asyncHandler } from "../middlewares/asyncHandler";
import authenticator from "../middlewares/authenticator";

import { OrderService } from "../services/orderService";
import { createOrderValidator } from "../validators/createOrderValidator";

const router = express.Router();

const orderService = new OrderService();
const orderController = new OrderController(orderService, logger);

router.post(
    "/:storeId",
    authenticator,
    createOrderValidator,
    asyncHandler(orderController.create),
);

export default router;
