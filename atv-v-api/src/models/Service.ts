import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne} from 'typeorm';
import Metadata from './Metadata';

@Entity('service')
class Service extends Metadata {
    @Column('varchar', {
        length: 30,
        nullable: false
    })
    name: string;

    @Column('varchar', {
        length: 30,
        nullable: false
    })
    duration: string;

    @Column('float', {
        nullable: false
    })
    price: number;
};

export default Service;