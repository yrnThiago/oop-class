import { IOrderRepository } from "../interfaces/Order";
import Order from "../models/Order";
import { DeleteResult, In, Repository } from "typeorm";
import Product from "../models/Product";
import Service from "../models/Service";

class OrderRepository implements IOrderRepository {
    orderRepository: Repository<Order>;

    constructor(orderRepository: Repository<Order>) {
        this.orderRepository = orderRepository;
    };

    async add(order: Order): Promise<Order> {
        order = await this.orderRepository.save(order);
    
        return order;
    };
    
    async getMany(skip: number, take: number, _page: number): Promise<[Order[], number]> {
        const [orders, total] = await this.orderRepository.findAndCount({
            relations: {
                client: true,
                items: {
                    product: true,
                    service: true,
                }
            },
            skip,
            take
        });
        
        return [orders, total];
    };

    async getByProductMostSold(): Promise<Order[]> {
        const orders = await this.orderRepository.find({
            relations: {
                items: {
                    product: true,
                },
            },
        });
    
        return orders;
    }
    
    async getByServiceMostSold(): Promise<Order[]> {
        const orders = await this.orderRepository.find({
            relations: {
                items: {
                    service: true,
                },
            },
        });
    
        return orders;
    }    

    async getById(id: number): Promise<Order> {
        const order = await this.orderRepository.findOneBy({
            id
        });
    
        return order;
    };

    async updateById(newOrderData: Order): Promise<Order> {
        const updatedOrder = await this.orderRepository.save(newOrderData);

        return updatedOrder;
    };

    async deleteById(id: number): Promise<DeleteResult> {
        const deletedRow = await this.orderRepository.delete({
            id
        });

        return deletedRow;
    };
};

export default OrderRepository;