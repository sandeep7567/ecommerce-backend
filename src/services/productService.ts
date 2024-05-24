import ProductModel from "../model/product";
import { Filter, ProductI } from "../types";

export class ProductService {
    constructor() {}

    async createProduct(product: ProductI): Promise<ProductI | null> {
        const newProduct = new ProductModel(product);

        return newProduct.save();
    }

    async getProduct(productId: string): Promise<ProductI | null> {
        return (await ProductModel.findById(productId)) as ProductI;
    }

    async getProducts(filters: Filter): Promise<ProductI[]> {
        const matchQuery = {
            ...filters,
        };

        const products = await ProductModel.aggregate<ProductI>([
            {
                $match: matchQuery,
            },
            {
                $sort: { createdAt: 1 },
            },
            // {
            //     $lookup: {
            //         from: "categories", // Assuming this is the collection name for categories
            //         localField: "categoryId", // Assuming categoryId is the reference field in the products collection
            //         foreignField: "_id",
            //         as: "category",
            //         pipeline: [
            //             {
            //                 $project: {
            //                     _id: 1,
            //                     name: 1,
            //                     attributes: 1,
            //                     priceConfiguration: 1,
            //                 },
            //             },
            //         ],
            //     },
            // },
            // {
            //     $unwind: "$category",
            // },
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
}
