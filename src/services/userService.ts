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
}
