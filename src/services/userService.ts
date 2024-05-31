import mongoose from "mongoose";
import UserModel from "../model/user";
import { CreateUserT, Filter, UserI } from "../types/index";

export class UserService {
    async create(user: CreateUserT) {
        const newUser = new UserModel(user);

        return await newUser.save();
    }

    async findByEmailWithPassword(email: string) {
        return await UserModel.findOne({ email });
    }

    async findById(id: string) {
        return await UserModel.findById(id).select(["-password"]);
    }

    async pushStoreId(userId: string, storeId: mongoose.Types.ObjectId) {
        return await UserModel.findByIdAndUpdate(
            userId,
            {
                $push: { storeId },
            },
            { new: true },
        );
    }

    async findByStoreId({
        pageIndex = 1,
        pageSize = 10,
    }: Filter): Promise<UserI[]> {
        const matchQuery: Filter = {};

        const skip = (pageIndex - 1) * pageSize;

        const users = await UserModel.aggregate<UserI>([
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
                $lookup: {
                    from: "stores", // Replace with your actual stores collection name
                    localField: "storeId",
                    foreignField: "_id",
                    as: "storeDetails",
                },
            },
            {
                $project: {
                    _id: 1,
                    email: 1,
                    firstName: 1,
                    lastName: 1,
                    role: 1,
                    storeDetails: 1,
                    createdAt: 1,
                },
            },
        ]).exec();

        return users;
    }

    async userCount(storeId?: mongoose.Types.ObjectId): Promise<number> {
        return (await UserModel.countDocuments({})) as number;
    }
}
