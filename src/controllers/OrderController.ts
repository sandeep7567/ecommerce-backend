import mongoose from "mongoose";
import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Logger } from "winston";
import { StoreService } from "./../services/storeService";
import { OrderService } from "./../services/orderService";
import {
    DeleteBulkRequest,
    OrderRequest,
    OrderRequestI,
    StoreRequest,
} from "../types";

export class OrderController {
    constructor(
        private orderService: OrderService,
        private storeService: StoreService,
        private logger: Logger,
    ) {}

    create = async (req: OrderRequestI, res: Response, next: NextFunction) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        if (!req?.params?.storeId || typeof req?.params?.storeId !== "string") {
            return next(createHttpError(404, "Store Id not found"));
        }

        const { storeId } = req.params;
        const store = await this.storeService.getStoreById(storeId);

        if (!store) {
            return next(createHttpError(404, "Order not found"));
        }

        try {
            const newOrder = await this.orderService.createOrder({
                ...req.body,
                storeId,
            });

            this.logger.info("Order created", { id: newOrder?._id });

            res.status(201).json({ id: newOrder?._id });
        } catch (err) {
            next(err);
            return;
        }
    };

    getAll = async (req: StoreRequest, res: Response, next: NextFunction) => {
        const { storeId } = req.params;
        const { pageIndex = 1, pageSize = 5 } = req.query;

        if (!storeId) {
            return next(createHttpError(400, "Store id is required"));
        }

        const orders = await this.orderService.getOrders(
            {
                storeId: new mongoose.Types.ObjectId(storeId),
            },
            { pageIndex: Number(pageIndex), pageSize: Number(pageSize) },
        );

        const totalDocs = await this.orderService.ordersCount(storeId);

        if (!orders) {
            return next(createHttpError(404, "Orders not found"));
        }

        const ordersDocuments = {
            orders,
            totalDocs,
            pageIndex: Number(pageIndex),
            pageSize: Number(pageSize),
            pageCount: Math.ceil(totalDocs / Number(pageSize)),
        };

        return res.json({
            ...ordersDocuments,
        });
    };

    getOne = async (req: OrderRequest, res: Response, next: NextFunction) => {
        if (!req.params?.orderId || !req.params._id) {
            return next(createHttpError(400, "Order id is required"));
        }

        const { orderId } = req.params;

        if (!orderId) {
            return next(createHttpError(400, "Missing orderId"));
        }

        try {
            const order = await this.orderService.getOrder(orderId);

            return res.json({ order });
        } catch (error) {
            next(createHttpError(500, "Internal error"));
        }
    };

    update = async (req: OrderRequestI, res: Response, next: NextFunction) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { storeId, orderId } = req.params;

        if (!storeId) {
            return next(createHttpError(404, "Store not exists"));
        }

        if (!orderId) {
            return next(createHttpError(404, "Order not exists"));
        }

        try {
            const existingOrder = await this.orderService.getOrder(orderId);

            if (!existingOrder) {
                return next(createHttpError(404, "Order not found"));
            }

            if (String(existingOrder.storeId) !== storeId) {
                return next(createHttpError(403, "Forbidden for this order"));
            }

            // const order = await this.orderService.updateOrder(
            //     orderId,
            //     req.body,
            // );

            this.logger.info(`Order updated with`);

            res.json({ id: existingOrder._id });
        } catch (err) {
            next(err);
            return;
        }
    };

    destroy = async (req: OrderRequest, res: Response, next: NextFunction) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        if (!req.params.storeId) {
            return next(createHttpError(400, "Store id is required"));
        }

        if (!req.params.orderId) {
            return next(createHttpError(400, "Missing order is required"));
        }

        try {
            const { orderId, storeId } = req.params;

            const existingOrder = await this.orderService.getOrder(orderId);

            if (!existingOrder) {
                return next(createHttpError(404, "Order not found"));
            }

            if (String(existingOrder.storeId) !== storeId) {
                return next(createHttpError(403, "Forbidden for this order"));
            }

            const order = await this.orderService.deleteById(orderId);

            this.logger.info(`Delete order by Id`, { id: order._id });

            res.json({ id: order._id });
        } catch (err) {
            next(err);
            return;
        }
    };

    bulkDestroy = async (
        req: DeleteBulkRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        if (!req.params.storeId) {
            return next(createHttpError(400, "Store id is required"));
        }

        try {
            const { storeId } = req.params;

            const { deleteResult, orders } = await this.orderService.bulkDelete(
                req.body,
                storeId,
            );

            const ids = orders.map((order) => order._id);

            this.logger.info(`Delete Bulk orders by Ids`, {
                ids,
            });

            res.json({
                ids,
                deletedCount: deleteResult.deletedCount,
                success: deleteResult.acknowledged,
            });
        } catch (err) {
            next(err);
            return;
        }
    };
}
