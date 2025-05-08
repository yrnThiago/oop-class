import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne} from 'typeorm';
import Metadata from './Metadata';

@Entity('products')
class Product extends Metadata {
    @Column('varchar', {
        length: 30,
        nullable: false
    })
    name: string;

    @Column('varchar', {
        length: 30,
        nullable: false
    })
    category: string;

    @Column('float', {
        nullable: false
    })
    price: number;

    @Column('int', {
        nullable: false
    })
    stock: number;
};

export default Product;