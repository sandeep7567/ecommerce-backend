import express from "express";

import multer from "multer";
import logger from "../config/logger";
import { ProductController } from "../controllers/ProductController";
import { asyncHandler } from "../middlewares/asyncHandler";
import authenticator from "../middlewares/authenticator";
import { storeByUserIdCheck } from "../middlewares/storeByUserIdCheck";
import { ProductService } from "../services/productService";
import { StoreService } from "../services/storeService";
import { UserService } from "../services/userService";
import createProductValidator from "../validators/createProductValidator";
import { CloudinaryStorage } from "../storage/cloudinaryStorage";
import updateProductValidator from "../validators/updateProductValidator";

const memoryStorage = multer.memoryStorage();
const upload = multer({
    storage: memoryStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, //5mb
    },
});

const router = express.Router();

const productService = new ProductService();
const storage = new CloudinaryStorage();
const productController = new ProductController(
    productService,
    storage,
    logger,
);

router.post(
    "/:storeId",
    authenticator,
    storeByUserIdCheck,
    upload.single("imageFile"),
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
    upload.single("imageFile"),
    updateProductValidator,
    asyncHandler(productController.update),
);

router.delete(
    "/:storeId/:productId",
    authenticator,
    storeByUserIdCheck,
    asyncHandler(productController.destroy),
);

export default router;
