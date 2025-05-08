import { DeleteResult } from "typeorm";
import { IProductRepository, IProductService } from "../interfaces/Product";
import Product from "../models/Product";
import { validationsUtils } from "../utils/Validation";

class ProductService implements IProductService{
    productRepository: IProductRepository

    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    };

    async add(product: Product): Promise<Product> {
        await validationsUtils.validateObject(Product, product);
        product = await this.productRepository.add(product);

        return product;
    };

    async getMany(skip: number=0, take: number=10, page: number=1): Promise<[Product[], Number]> {
        const [products, total] = await this.productRepository.getMany(skip, take, page);

        return [products, total];
    };

    async getById(id: number): Promise<Product> {
        const product = await this.productRepository.getById(id);

        return product;
    };

    async updateById(product: Product, newProductData: Product): Promise<Product> {
        Object.assign(product, newProductData);

        await validationsUtils.validateObject(Product, product);
        const updatedProduct = await this.productRepository.updateById(product);

        return updatedProduct;
    };

    async deleteById(id: number): Promise<DeleteResult> {
        const deletedRow = await this.productRepository.deleteById(id);

        return deletedRow;
    }
};

export default ProductService;
