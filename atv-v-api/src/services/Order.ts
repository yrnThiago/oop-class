import { DeleteResult } from "typeorm";
import { IOrderRepository, IOrderService } from "../interfaces/Order";
import Order from "../models/Order";
import { validationsUtils } from "../utils/Validation";
import Product from "../models/Product";
import Service from "../models/Service";

class OrderService implements IOrderService{
    orderRepository: IOrderRepository

    constructor(orderRepository: IOrderRepository) {
        this.orderRepository = orderRepository;
    };

    async add(order: Order): Promise<Order> {
        await validationsUtils.validateObject(Order, order);
        order = await this.orderRepository.add(order);

        return order;
    };

    async getMany(skip: number=0, take: number=10, page: number=1): Promise<[Order[], Number]> {
        const [orders, total] = await this.orderRepository.getMany(skip, take, page);

        return [orders, total];
    };

    async getById(id: number): Promise<Order> {
        const order = await this.orderRepository.getById(id);

        return order;
    };

    async getByProductMostSold(): Promise<{ product: Product; totalSold: number }[]> {
        const orders = await this.orderRepository.getByProductMostSold();

        const productSales = new Map<number, { product: Product; totalSold: number }>();
    
        orders.forEach((order) => {
            order.items.forEach((item) => {
                if (item.product) {
                    const productId = item.product.id;
                    const currentTotal = productSales.get(productId)?.totalSold || 0;
                    productSales.set(productId, {
                        product: item.product,
                        totalSold: currentTotal + item.quantity,
                    });
                }
            });
        });
    
        const sortedProductSales = Array.from(productSales.values()).sort(
            (a, b) => b.totalSold - a.totalSold
        );
    
        return sortedProductSales;
    };


    async getByServiceMostSold(): Promise<{ service: Service; totalSold: number }[]> {
        const orders = await this.orderRepository.getByServiceMostSold();

        const serviceSales = new Map<number, { service: Service; totalSold: number }>();
    
        orders.forEach((order) => {
            order.items.forEach((item) => {
                if (item.service) {
                    const serviceId = item.service.id;
                    const currentTotal = serviceSales.get(serviceId)?.totalSold || 0;
                    serviceSales.set(serviceId, {
                        service: item.service,
                        totalSold: currentTotal + item.quantity,
                    });
                }
            });
        });
    
        const sortedServiceSales = Array.from(serviceSales.values()).sort(
            (a, b) => b.totalSold - a.totalSold
        );
    
        return sortedServiceSales;
    };

    async updateById(order: Order, newOrderData: Order): Promise<Order> {
        Object.assign(order, newOrderData);

        await validationsUtils.validateObject(Order, order);
        const updatedOrder = await this.orderRepository.updateById(order);

        return updatedOrder;
    };

    async deleteById(id: number): Promise<DeleteResult> {
        const deletedRow = await this.orderRepository.deleteById(id);

        return deletedRow;
    }
};

export default OrderService;
