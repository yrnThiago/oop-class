import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne} from 'typeorm';
import Metadata from './Metadata';
import Client from './Client';

@Entity('pets')
class Pet extends Metadata {
    @Column('varchar', {
        length: 20,
        nullable: false
    })
    name: string;

    @Column('varchar', {
        length: 50,
        nullable: false
    })
    type: string;

    @Column('varchar', {
        length: 50,
        nullable: false
    })
    race: string;

    @Column('varchar', {
        length: 10,
        nullable: false
    })
    gender: string;

    @ManyToOne(() => Client, (client) => client.pet, {nullable: false})
    @JoinColumn({ name: 'id_client' })
    client: Client;

};

export default Pet;