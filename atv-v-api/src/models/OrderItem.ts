import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import Order from './Order';
import Metadata from './Metadata';
import Product from './Product';
import Service from './Service';

@Entity('order_items')
class OrderItem extends Metadata {
    @ManyToOne(() => Product, { nullable: true })
    @JoinColumn({ name: 'product_id' })
    product?: Product;

    @ManyToOne(() => Service, { nullable: true })
    @JoinColumn({ name: 'service_id' })
    service?: Service;

    @ManyToOne(() => Order, (order) => order.items, { nullable: false })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column('int', { nullable: false })
    quantity: number;

    @Column('float', { nullable: false })
    totalPrice: number;
}

export default OrderItem;
