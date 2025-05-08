import Order from "../models/Order";
import { NextFunction, Request, Response } from "express";
import { IOrderController, IOrderService } from "../interfaces/Order";
import HttpStatus from 'http-status-codes';

class OrderController implements IOrderController {
    orderService: IOrderService;

    constructor(orderService: IOrderService) {
        this.orderService = orderService;

        this.add = this.add.bind(this);
        this.getMany = this.getMany.bind(this);
        this.getById = this.getById.bind(this);
        this.getByProductMostSold = this.getByProductMostSold.bind(this);
        this.getByServiceMostSold = this.getByServiceMostSold.bind(this);
        this.updateById = this.updateById.bind(this);
        this.deleteById = this.deleteById.bind(this);
    };

    async add(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const order = req.body;
            if(!order.client) {
                return res.status(HttpStatus.BAD_REQUEST).json({message: "order body missing"});
            };

            const newOrder = await this.orderService.add(order);
            return res.status(HttpStatus.OK).json(newOrder);
        } catch (error) {
            next(error);  
        };
    };

    async getMany(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const take = Number(req.query.take) || 10;
            const page = Number(req.query.page) || 1;
            const skip = (page-1) * take;

            const [orders, total] = await this.orderService.getMany(skip, take, page);
            if (orders.length === 0) return res.status(HttpStatus.OK).json({message: "no order was created"});

            return res.status(HttpStatus.OK).json({orders, total});
        } catch (error) {
            next(error);
        };
    };

    async getByProductMostSold(_req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const orders = await this.orderService.getByProductMostSold();
            if(!orders) return res.status(HttpStatus.NOT_FOUND).json({message: "orders not found"});
    
            return res.status(HttpStatus.OK).json(orders);
        } catch (error) {
            next(error);
        };
        
    };

    async getByServiceMostSold(_req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const orders = await this.orderService.getByServiceMostSold();
            if(!orders) return res.status(HttpStatus.NOT_FOUND).json({message: "orders not found"});
    
            return res.status(HttpStatus.OK).json(orders);
        } catch (error) {
            next(error);
        };
        
    };

    async getById(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            if(!id) return res.status(HttpStatus.BAD_REQUEST).json({message: "order id missing"});
    
            const order = await this.orderService.getById(id);
            if(!order) return res.status(HttpStatus.NOT_FOUND).json({message: "order not found"});
    
            return res.status(HttpStatus.OK).json(order);
        } catch (error) {
            next(error);
        };
        
    };
    async updateById(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            const id = parseInt(req.params.id);
            if(!id) return res.status(HttpStatus.BAD_REQUEST).json({message: "order id missing"});
      
            const newOrderData = req.body;
            if(!newOrderData) return res.status(HttpStatus.BAD_REQUEST).json({message: "new order body missing"});
      
            const order = await this.orderService.getById(id);
            if(!order) return res.status(HttpStatus.NOT_FOUND).json({message: "order not found"});
      
            const updatedOrder = await this.orderService.updateById(order, newOrderData);
      
            return res.status(HttpStatus.OK).json(updatedOrder); 
        } catch (error) {
            next(error);
        };
    };

    async deleteById(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            const id = parseInt(req.params.id);
            if(!id) return res.status(HttpStatus.BAD_REQUEST).json({message: "order id missing"});
    
            const deletedRow = await this.orderService.deleteById(id);
            if(!deletedRow.affected) return res.status(HttpStatus.BAD_REQUEST).json({message: "order not found"});
    
            return res.status(HttpStatus.OK).json({message: `order id ${id} deleted`});
        } catch (error) {
            next(error);
        };
    };
};

export default OrderController;