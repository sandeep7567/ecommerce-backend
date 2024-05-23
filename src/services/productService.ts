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
}
