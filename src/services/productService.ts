import mongoose from "mongoose";
import ProductModel from "../model/product";
import { BulkIdsIds, Filter, ProductI } from "../types";

export class ProductService {
    constructor() {}

    async createProduct(product: ProductI): Promise<ProductI | null> {
        const newProduct = new ProductModel(product);

        return newProduct.save();
    }

    async getProduct(productId: string): Promise<ProductI | null> {
        const matchQuery = {
            _id: new mongoose.Types.ObjectId(productId),
        };

        const products = await ProductModel.aggregate<ProductI>([
            {
                $match: matchQuery,
            },
            {
                $project: {
                    _id: 1,
                    storeId: 1,
                    name: 1,
                    price: 1,
                    archived: 1,
                    featured: 1,
                    properties: 1,
                    imageFile: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ]).exec();

        return products.length > 0 ? products[0] : null;
    }

    async getProducts(
        filters: Filter,
        { pageIndex = 1, pageSize = 10 }: Filter,
    ): Promise<ProductI[]> {
        const matchQuery: Filter = {
            ...filters,
        };

        const skip = (pageIndex - 1) * pageSize;

        const products = await ProductModel.aggregate<ProductI>([
            {
                $match: matchQuery,
            },
            {
                $sort: { createdAt: 1 },
            },
            {
                $skip: skip,
            },
            {
                $limit: pageSize,
            },
            {
                $project: {
                    _id: 1,
                    storeId: 1,
                    name: 1,
                    price: 1,
                    archived: 1,
                    featured: 1,
                    properties: 1,
                    imageFile: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ]).exec();

        // Return the products
        return products;
    }

    async productCount(storeId: mongoose.Types.ObjectId): Promise<number> {
        return (await ProductModel.countDocuments({
            storeId,
        })) as number;
    }

    async updateProduct(
        productId: string,
        product: ProductI,
    ): Promise<null | ProductI> {
        return (await ProductModel.findOneAndUpdate(
            { _id: productId },
            { $set: product },
            { new: true },
        )) as ProductI;
    }

    async deleteById(productId: string) {
        return (await ProductModel.findByIdAndDelete(productId)) as ProductI;
    }

    async bulkDelete({ ids }: BulkIdsIds, storeId: string) {
        const objectProductIds = ids.map(
            (id) => new mongoose.Types.ObjectId(id),
        );

        const products = await ProductModel.find({
            storeId: new mongoose.Types.ObjectId(storeId),
            _id: { $in: objectProductIds },
        });

        const deleteResult = await ProductModel.deleteMany({
            storeId: new mongoose.Types.ObjectId(storeId),
            _id: { $in: objectProductIds },
        });

        return { products, deleteResult };
    }
}
