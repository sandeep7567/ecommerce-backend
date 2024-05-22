import mongoose from "mongoose";
import UserModel from "../model/user";
import { CreateUserT } from "../types/index";

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
}
