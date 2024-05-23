import mongoose from "mongoose";
import { ProductI, PropertyI } from "../types";

const propertySchema = new mongoose.Schema<PropertyI>({
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
            type: String,
            required: true,
        },
        storeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
        },
        imageFile: {
            type: String,
            required: false,
        },
        properties: [
            {
                type: [propertySchema], // Use the property schema for dynamic attributes
                required: true,
            },
        ],
    },
    { timestamps: true },
);

export default mongoose.model<ProductI>("Product", productSchema);
