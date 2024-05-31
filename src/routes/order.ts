import express from "express";
import logger from "../config/logger";
import { OrderController } from "../controllers/OrderController";
import { asyncHandler } from "../middlewares/asyncHandler";
import authenticator from "../middlewares/authenticator";

import { OrderService } from "../services/orderService";
import { createOrderValidator } from "../validators/createOrderValidator";
import { param } from "express-validator";
import { storeByUserIdCheck } from "../middlewares/storeByUserIdCheck";
import bulkDeleteProductValidator from "../validators/bulkDeleteValidator";
import bulkDeleteValidator from "../validators/bulkDeleteValidator";

const router = express.Router();

const orderService = new OrderService();
const orderController = new OrderController(orderService, logger);

router.post(
    "/:storeId",
    authenticator,
    createOrderValidator,
    asyncHandler(orderController.create),
);

router.get("/:storeId", asyncHandler(orderController.getAll));

router.get(
    "/:orderId",
    param("productId")
        .isString()
        .withMessage("Order ID must be provided")
        .notEmpty()
        .withMessage("Order ID must not be empty"),
    param("_id")
        .isString()
        .withMessage("_id ID must be provided")
        .notEmpty()
        .withMessage("_id ID must not be empty"),
    asyncHandler(orderController.getOne),
);

router.patch(
    "/:storeId/:orderId",
    authenticator,
    storeByUserIdCheck,
    createOrderValidator,
    asyncHandler(orderController.update),
);

router.delete(
    "/:storeId/:orderId",
    authenticator,
    storeByUserIdCheck,
    asyncHandler(orderController.destroy),
);

router.post(
    "/:storeId/bulk-delete",
    authenticator,
    storeByUserIdCheck,
    bulkDeleteValidator,
    asyncHandler(orderController.bulkDestroy),
);

export default router;
