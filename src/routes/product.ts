import express from "express";

import logger from "../config/logger";
import { asyncHandler } from "../middlewares/asyncHandler";
import authenticator from "../middlewares/authenticator";
import { StoreService } from "../services/storeService";
import { ProductService } from "../services/productService";
import { UserService } from "../services/userService";
import { storeByUserIdCheck } from "../middlewares/storeByUserIdCheck";
import { ProductController } from "../controllers/ProductController";
import createProductValidator from "../validators/createProductValidator";
import fileUpload from "express-fileupload";
import createHttpError from "http-errors";

const router = express.Router();

const storeService = new StoreService();
const productService = new ProductService();
const userService = new UserService();
const productController = new ProductController(
    productService,
    storeService,
    userService,
    logger,
);

router.post(
    "/:storeId",
    authenticator,
    storeByUserIdCheck,
    fileUpload({
        limits: { fileSize: 500 * 1024 }, // 500kb
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            const error = createHttpError(400, "File size exceeds the limit");
            next(error);
        },
    }),
    createProductValidator,
    asyncHandler(productController.create),
);

router.get(
    "/:storeId",
    authenticator,
    storeByUserIdCheck,
    asyncHandler(productController.getAll),
);

router.get(
    "/:productId",
    authenticator,
    asyncHandler(productController.getOne),
);

router.patch(
    "/:storeId/:productId",
    authenticator,
    storeByUserIdCheck,
    asyncHandler(productController.update),
);

router.delete(
    "/:storeId/:productId",
    authenticator,
    storeByUserIdCheck,
    asyncHandler(productController.destroy),
);

export default router;
