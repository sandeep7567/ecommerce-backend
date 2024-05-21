import mongoose from "mongoose";
import { RefreshTokenI, UserI } from "../types";

const refreshTokenSchema = new mongoose.Schema<RefreshTokenI>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true },
);

export default mongoose.model<RefreshTokenI>(
    "RefreshToken",
    refreshTokenSchema,
);
