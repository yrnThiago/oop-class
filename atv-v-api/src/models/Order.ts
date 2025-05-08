import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import Client from './Client';
import OrderItem from './OrderItem';
import Metadata from './Metadata';

@Entity('orders')
class Order extends Metadata {
    @ManyToOne(() => Client, (client) => client.orders)
    client: Client;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    items: OrderItem[];

    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount: number;

    @Column('varchar', { length: 20 })
    status: string;
}

export default Order;
