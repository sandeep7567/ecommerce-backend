import mongoose from "mongoose";
import OrderModel from "../model/order";
import {
    BulkIdsIds,
    Filter,
    OrderI,
    OrderSchemaI,
    PaginationFilter,
    ProductI,
} from "../types";

export class OrderService {
    constructor() {}

    async createOrder(order: OrderI): Promise<OrderSchemaI | null> {
        const newOrder = new OrderModel(order);

        return newOrder.save();
    }

    async getOrder(orderId: string): Promise<OrderSchemaI | null> {
        const matchQuery = {
            _id: new mongoose.Types.ObjectId(orderId),
        };

        const orders = await OrderModel.aggregate<OrderSchemaI>([
            {
                $match: matchQuery,
            },
            {
                $project: {
                    _id: 1,
                    productInfo: 1,
                    orderId: 1,
                    storeId: 1,
                    userId: 1,
                    totalAmount: 1,
                    purchaseAt: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ]).exec();

        return orders.length > 0 ? orders[0] : null;
    }

    async getOrders(
        filters: Filter,
        { pageIndex = 1, pageSize = 10 }: PaginationFilter,
    ): Promise<OrderSchemaI[]> {
        const matchQuery: Filter = {
            ...filters,
        };

        const skip = (pageIndex - 1) * pageSize;

        const orders = await OrderModel.aggregate<OrderSchemaI>([
            {
                $match: matchQuery,
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $skip: skip,
            },
            {
                $limit: pageSize,
            },
            {
                $project: {
                    _id: 1,
                    userInfo: 1,
                    orderItems: 1,
                    totalAmount: 1,
                    totalQty: 1,
                    purchaseAt: 1,
                    status: 1,
                    address: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ]).exec();

        return orders;
    }

    async ordersCount(
        storeId: mongoose.Types.ObjectId | string,
    ): Promise<number> {
        return (await OrderModel.countDocuments({
            storeId,
        })) as number;
    }

    async updateOrder(
        orderId: string,
        order: OrderSchemaI,
    ): Promise<null | OrderSchemaI> {
        return (await OrderModel.findOneAndUpdate(
            { _id: orderId },
            { $set: order },
            { new: true },
        )) as OrderSchemaI;
    }

    async deleteById(orderId: string) {
        return (await OrderModel.findByIdAndDelete(orderId)) as OrderSchemaI;
    }

    async bulkDelete({ ids }: BulkIdsIds, storeId: string) {
        const objectOrderIds = ids.map((id) => new mongoose.Types.ObjectId(id));

        const orders = await OrderModel.find({
            storeId: new mongoose.Types.ObjectId(storeId),
            _id: { $in: objectOrderIds },
        });

        const deleteResult = await OrderModel.deleteMany({
            storeId: new mongoose.Types.ObjectId(storeId),
            _id: { $in: objectOrderIds },
        });

        return { orders, deleteResult };
    }
}
