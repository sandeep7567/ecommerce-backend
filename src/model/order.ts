import mongoose from "mongoose";
import { OrderItemsSchema, OrderSchemaI, STATUS } from "../types";

const OrderProductsSchema = new mongoose.Schema<OrderItemsSchema>({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: { type: String, required: true },
    imageFile: { type: String, required: true },
    selectedProperty: { type: Map, of: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema<OrderSchemaI>(
    {
        orderItems: { type: [OrderProductsSchema], required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
        totalAmount: { type: Number, required: true },
        totalQty: { type: Number, required: true },
        purchaseAt: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: Object.values(STATUS),
            default: STATUS.PENDING,
        },
        userInfo: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String, required: true },
        },
        address: { type: String, required: true },
    },
    { timestamps: true },
);

// Define and export the Mongoose model
export default mongoose.model<OrderSchemaI>("Order", orderSchema);
