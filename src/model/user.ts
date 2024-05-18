import mongoose from "mongoose";
import { Roles, UserI } from "../types";

const userSchema = new mongoose.Schema<UserI>(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        isEmailVerified: {
            type: Boolean,
            required: true,
            default: false,
        },
        password: {
            type: String,
            required: true,
        },
        storeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            default: null,
        },
        isPublish: {
            type: Boolean,
            default: false,
            required: false,
        },

        role: {
            type: String,
            enum: Object.values(Roles),
            default: Roles.CUSTOMER,
        },
    },
    { timestamps: true },
);

export default mongoose.model<UserI>("User", userSchema);
