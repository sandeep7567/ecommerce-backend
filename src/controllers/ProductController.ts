import { NextFunction, Response } from "express";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { ProductService } from "../services/productService";
import { StoreService } from "../services/storeService";
import { UserService } from "../services/userService";
import {
    AuthRequest,
    CreateProductRequest,
    CreateStoreRequest,
    ProductI,
    StoreI,
    StoreRequest,
} from "../types";
import ProductModal from "../model/product";
import { v4 as uuidv4 } from "uuid";
import { UploadApiResponse } from "cloudinary";
import { FileStorage } from "../types/storage";

export class ProductController {
    constructor(
        private productService: ProductService,
        private storage: FileStorage,
        private logger: Logger,
    ) {}

    create = async (
        req: CreateProductRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        try {
            const { properties } = req.body;

            const isPropertyValueCorrect = properties.every((prop) =>
                (prop.value as string).includes(","),
            );
            if (!isPropertyValueCorrect) {
                return next(
                    createHttpError(
                        400,
                        `please include "," for every new value property`,
                    ),
                );
            }

            const formattedProperty = req.body.properties.map((prop) => ({
                name: prop.name,
                value: (prop.value as string).split(","),
            }));

            const image = req.file as Express.Multer.File;
            const imageName = uuidv4();

            const imageResult = (await this.storage.upload({
                fileData: image.buffer,
                filename: imageName,
                fileMimeType: image.mimetype,
            })) as UploadApiResponse;

            const product: ProductI = {
                ...req.body,
                properties: formattedProperty,
                storeId: new mongoose.Types.ObjectId(req.params.storeId),
                imageFile: imageResult.public_id,
            };

            const newProduct = await this.productService.createProduct(product);

            this.logger.info("Product created", { id: newProduct?._id });

            res.status(200).json({ product: newProduct });
        } catch (err) {
            next(err);
            return;
        }
    };

    getAll = async (req: StoreRequest, res: Response, next: NextFunction) => {
        const authReq = req as AuthRequest;

        const { sub } = authReq.auth;

        try {
            const store = await this.productService.getProduct(sub);

            if (!store) {
                next(createHttpError(404, "Store not found"));
                return;
            }

            return res.json({ store });
        } catch (error) {
            next(createHttpError(500, "Internal error"));
        }
    };

    getOne = async (req: StoreRequest, res: Response, next: NextFunction) => {
        const authReq = req as AuthRequest;

        const { sub } = authReq.auth;

        try {
            const store = await this.productService.getProduct(sub);

            if (!store) {
                next(createHttpError(404, "Store not found"));
                return;
            }

            return res.json({ store });
        } catch (error) {
            next(createHttpError(500, "Internal error"));
        }
    };

    update = async (
        req: CreateStoreRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { sub } = (req as AuthRequest).auth;
        const { storeId } = req.params;

        try {
            const store: Pick<StoreI, "_id" | "name" | "userId"> = {
                name: req.body.name,
                _id: new mongoose.Types.ObjectId(storeId),
                userId: new mongoose.Types.ObjectId(sub),
            };

            // const updateStore = await this.productService.updateById(store);

            this.logger.info(`Update store by id`, { id: "updateStore?._id " });

            res.json({ id: "updateStore?._id" });
        } catch (err) {
            next(err);
            return;
        }
    };

    destroy = async (req: StoreRequest, res: Response, next: NextFunction) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { sub } = (req as AuthRequest).auth;
        const { storeId } = req.params;

        try {
            const store: Pick<StoreI, "_id" | "userId"> = {
                _id: new mongoose.Types.ObjectId(storeId),
                userId: new mongoose.Types.ObjectId(sub),
            };

            // await this.storeService.deleteById(store);

            this.logger.info(`Delete store by Id`, { id: store?._id });

            res.json({ id: store?._id });
        } catch (err) {
            next(err);
            return;
        }
    };
}
