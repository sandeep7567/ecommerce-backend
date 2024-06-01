import StoreModel from "../model/store";
import { Filter, IStore, OrderSchemaI, StoreI } from "../types";

export class StoreService {
    constructor() {}

    async create(store: IStore) {
        const newStore = new StoreModel(store);

        return await newStore.save();
    }

    async getStore(filters: Filter, { pageIndex = 1, pageSize = 10 }: Filter) {
        const matchQuery: Filter = {
            ...filters,
        };

        const skip = (pageIndex - 1) * pageSize;

        return await StoreModel.aggregate<StoreI>([
            {
                $match: matchQuery,
            },
            {
                $sort: { createdAt: 1 },
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
                    userId: 1,
                    name: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ]).exec();
    }

    async getStoreById(_id: string): Promise<OrderSchemaI | null> {
        return await StoreModel.findOne({ _id });
    }

    async updateById(store: Pick<StoreI, "_id" | "name" | "userId">) {
        const { name, userId, _id } = store;

        return await StoreModel.findOneAndUpdate(
            { userId, _id },
            { name },
            { new: true },
        );
    }

    async deleteById(store: Pick<StoreI, "_id" | "userId">) {
        const { userId, _id } = store;
        return await StoreModel.findOneAndDelete(
            {
                userId,
                _id,
            },
            { new: true },
        );
    }
}
