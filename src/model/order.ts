import mongoose, { Schema } from "mongoose";
import { OrderSchemaI, STATUS } from "../types";

const orderSchema = new Schema<OrderSchemaI>(
    {
        productInfo: [
            {
                productId: { type: String, required: true },
                productName: { type: String, required: true },
                qty: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],
        orderId: { type: String, required: true },
        storeId: { type: String, default: null },
        userId: { type: String, default: undefined },
        purchaseAt: { type: Date, required: true, default: Date.now },
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: Object.values(STATUS),
            required: true,
            default: STATUS.PENDING,
        },
    },
    { timestamps: true },
);

// Define and export the Mongoose model
export default mongoose.model<OrderSchemaI>("Order", orderSchema);
