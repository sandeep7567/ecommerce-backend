import mongoose from "mongoose";
import { StoreI } from "../types";

const storeSchema = new mongoose.Schema<StoreI>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true },
);

export default mongoose.model<StoreI>("Store", storeSchema);
