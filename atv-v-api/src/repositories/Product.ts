import { IProductRepository } from "../interfaces/Product";
import Product from "../models/Product";
import { DeleteResult, In, Repository } from "typeorm";

class ProductRepository implements IProductRepository {
    productRepository: Repository<Product>;

    constructor(productRepository: Repository<Product>) {
        this.productRepository = productRepository;
    };

    async add(product: Product): Promise<Product> {
        product = await this.productRepository.save(product);
    
        return product;
    };
    
    async getMany(skip: number, take: number, _page: number): Promise<[Product[], number]> {
        const [products, total] = await this.productRepository.findAndCount({
            skip,
            take
        });
        
        return [products, total];
    };

    async getById(id: number): Promise<Product> {
        const product = await this.productRepository.findOneBy({
            id
        });
    
        return product;
    };

    async updateById(newProductData: Product): Promise<Product> {
        const updatedProduct = await this.productRepository.save(newProductData);

        return updatedProduct;
    };

    async deleteById(id: number): Promise<DeleteResult> {
        const deletedRow = await this.productRepository.delete({
            id
        });

        return deletedRow;
    };
};

export default ProductRepository;