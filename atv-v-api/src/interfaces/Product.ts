/* eslint-disable no-unused-vars */
import Product from "../models/Product";
import { NextFunction, Request, Response } from "express";
import IRouter from "./Router";
import { DeleteResult } from "typeorm";

interface IProductRepository {
  add(product: Product): Promise<Product>;
  getMany(skip: number, take: number, page: number): Promise<[Product[], Number]>;
  getById(id: number): Promise<Product>;
  updateById(newProductData: Product): Promise<Product>;
  deleteById(id: number): Promise<DeleteResult>;
};

interface IProductService {
  productRepository: IProductRepository;

  add(product: Product): Promise<Product>;
  getMany(skip?: number, take?: number, page?: number): Promise<[Product[], Number]>;
  getById(id: number): Promise<Product>;
  updateById(product: Product, newProductData: Product): Promise<Product>;
  deleteById(id: number): Promise<DeleteResult>;
};

interface IProductController {
  productService: IProductService;

  add(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  getMany(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  getById(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  updateById(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  deleteById(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
};

interface IProductRouter extends IRouter {
  productController: IProductController;
}

export {
  IProductRepository,
  IProductService,
  IProductController,
  IProductRouter
};