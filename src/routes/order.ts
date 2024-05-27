import express from "express";
import logger from "../config/logger";
import { OrderController } from "../controllers/OrderController";
import { asyncHandler } from "../middlewares/asyncHandler";
import authenticator from "../middlewares/authenticator";
import { storeByUserIdCheck } from "../middlewares/storeByUserIdCheck";

import { OrderService } from "../services/orderService";

const router = express.Router();

const orderService = new OrderService();
const orderController = new OrderController(orderService, logger);

router.post(
    "/:storeId",
    authenticator,
    storeByUserIdCheck,
    // createOrderValidator,
    asyncHandler(orderController.create),
);

export default router;
