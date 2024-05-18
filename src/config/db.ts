import mongoose from "mongoose";
import { Config } from ".";

export const initDb = async () => {
    await mongoose.connect(Config.MONGO_URL!);
};
