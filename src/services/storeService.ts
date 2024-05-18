import StoreModel from "../model/store";
import { IStore } from "../types";

export class StoreService {
    constructor() {}

    async create(store: IStore) {
        const newStore = new StoreModel(store);

        return await newStore.save();
    }

    async getByUserId(userId: string) {
        return await StoreModel.find({ userId });
    }
}
