import mongoose from "mongoose";
import { ProductI, PropertyI } from "../types";

const propertySchema = new mongoose.Schema<PropertyI>({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose.Types.ObjectId(),
    },
    name: {
        type: String,
        required: true,
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
});

const productSchema = new mongoose.Schema<ProductI>(
    {
        storeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
        },
        name: {
            type: String,
            required: true,
        },
        archived: {
            type: Boolean,
            required: true,
            default: false,
        },
        featured: {
            type: Boolean,
            required: true,
            default: false,
        },
        price: {
            type: Number,
            required: true,
        },
        imageFile: {
            type: String,
            required: false,
        },
        properties: [propertySchema],
    },
    { timestamps: true },
);

export default mongoose.model<ProductI>("Product", productSchema);
