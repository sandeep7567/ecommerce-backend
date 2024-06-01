import StoreModel from "../model/store";
import { IStore, OrderSchemaI, StoreI } from "../types";

export class StoreService {
    constructor() {}

    async create(store: IStore) {
        const newStore = new StoreModel(store);

        return await newStore.save();
    }

    async getStore() {
        return await StoreModel.find({});
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
