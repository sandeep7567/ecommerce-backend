import ProductModel from "../model/product";
import { ProductI } from "../types";

export class ProductService {
    constructor() {}

    async createProduct(product: ProductI): Promise<ProductI | null> {
        const newProduct = new ProductModel(product);

        return newProduct.save();
    }

    async getProduct(productId: string): Promise<ProductI | null> {
        return (await ProductModel.findById(productId)) as ProductI;
    }

    async getProducts(storeId: string): Promise<ProductI[]> {
        return (await ProductModel.find({ storeId })) as ProductI[];
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
}
