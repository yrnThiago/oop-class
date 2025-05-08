import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne, OneToMany, JoinTable, ManyToMany} from 'typeorm';
import Metadata from './Metadata';
import Pet from './Pet';
import Order from './Order';

@Entity('clients')
class Client extends Metadata {
    @Column('varchar', {
        length: 100,
        nullable: false
    })
    name: string;

    @Column('varchar', {
        length: 100,
        nullable: false,
        name: "social_name"
    })
    socialName: string;

    @Column('varchar', {
        length: 20,
        nullable: false
    })
    cpf: string;

    @Column('varchar', {
        length: 100,
        nullable: false,
        name: "contact_numbers"
    })
    contactNumbers: string[];

    @OneToMany(() => Pet, (pet) => pet.client, {eager: true})
    pet: Pet[];

    @OneToMany(() => Order, (order) => order.client, { eager: false })
    orders: Order[];
}

export default Client;