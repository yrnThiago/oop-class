/* eslint-disable no-unused-vars */
import Order from "../models/Order";
import { NextFunction, Request, Response } from "express";
import IRouter from "./Router";
import { DeleteResult } from "typeorm";
import Product from "../models/Product";
import Service from "../models/Service";

interface IOrderRepository {
  add(order: Order): Promise<Order>;
  getMany(skip: number, take: number, page: number): Promise<[Order[], Number]>;
  getById(id: number): Promise<Order>;
  getByProductMostSold(): Promise<Order[]>;
  getByServiceMostSold(): Promise<Order[]>;
  updateById(newOrderData: Order): Promise<Order>;
  deleteById(id: number): Promise<DeleteResult>;
};

interface IOrderService {
  orderRepository: IOrderRepository;

  add(order: Order): Promise<Order>;
  getMany(skip?: number, take?: number, page?: number): Promise<[Order[], Number]>;
  getById(id: number): Promise<Order>;
  getByProductMostSold(): Promise<{ product: Product; totalSold: number }[]>;
  getByServiceMostSold(): Promise<{ service: Service; totalSold: number }[]>;
  updateById(order: Order, newOrderData: Order): Promise<Order>;
  deleteById(id: number): Promise<DeleteResult>;
};

interface IOrderController {
  orderService: IOrderService;

  add(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  getMany(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  getById(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  getByProductMostSold(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  getByServiceMostSold(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  updateById(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  deleteById(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
};

interface IOrderRouter extends IRouter {
  orderController: IOrderController;
}

export {
  IOrderRepository,
  IOrderService,
  IOrderController,
  IOrderRouter
};