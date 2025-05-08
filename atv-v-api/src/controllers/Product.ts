import Product from "../models/Product";
import { NextFunction, Request, Response } from "express";
import { IProductController, IProductService } from "../interfaces/Product";
import HttpStatus from 'http-status-codes';

class ProductController implements IProductController {
    productService: IProductService;

    constructor(productService: IProductService) {
        this.productService = productService;

        this.add = this.add.bind(this);
        this.getMany = this.getMany.bind(this);
        this.getById = this.getById.bind(this);
        this.updateById = this.updateById.bind(this);
        this.deleteById = this.deleteById.bind(this);
    };

    async add(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const product = req.body;
            if(!product.name) {
                return res.status(HttpStatus.BAD_REQUEST).json({message: "product body missing"});
            };

            const newProduct = await this.productService.add(product);
            return res.status(HttpStatus.OK).json(newProduct);
        } catch (error) {
            next(error);  
        };
    };

    async getMany(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const take = Number(req.query.take) || 10;
            const page = Number(req.query.page) || 1;
            const skip = (page-1) * take;

            const [products, total] = await this.productService.getMany(skip, take, page);
            if (products.length === 0) return res.status(HttpStatus.OK).json({message: "no product was created"});

            return res.status(HttpStatus.OK).json({products, total});
        } catch (error) {
            next(error);
        };
    };

    async getById(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            if(!id) return res.status(HttpStatus.BAD_REQUEST).json({message: "product id missing"});
    
            const product = await this.productService.getById(id);
            if(!product) return res.status(HttpStatus.NOT_FOUND).json({message: "product not found"});
    
            return res.status(HttpStatus.OK).json(product);
        } catch (error) {
            next(error);
        };
        
    };
    async updateById(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            const id = parseInt(req.params.id);
            if(!id) return res.status(HttpStatus.BAD_REQUEST).json({message: "product id missing"});
      
            const newProductData = req.body;
            if(!newProductData) return res.status(HttpStatus.BAD_REQUEST).json({message: "new product body missing"});
      
            const product = await this.productService.getById(id);
            if(!product) return res.status(HttpStatus.NOT_FOUND).json({message: "product not found"});
      
            const updatedProduct = await this.productService.updateById(product, newProductData);
      
            return res.status(HttpStatus.OK).json(updatedProduct); 
        } catch (error) {
            next(error);
        };
    };

    async deleteById(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            const id = parseInt(req.params.id);
            if(!id) return res.status(HttpStatus.BAD_REQUEST).json({message: "product id missing"});
    
            const deletedRow = await this.productService.deleteById(id);
            if(!deletedRow.affected) return res.status(HttpStatus.BAD_REQUEST).json({message: "product not found"});
    
            return res.status(HttpStatus.OK).json({message: `product id ${id} deleted`});
        } catch (error) {
            next(error);
        };
    };
};

export default ProductController;