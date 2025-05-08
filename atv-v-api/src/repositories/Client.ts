import { IClientRepository } from "../interfaces/Client";
import Client from "../models/Client";
import { DeleteResult, In, Repository } from "typeorm";

class ClientRepository implements IClientRepository {
    clientRepository: Repository<Client>;

    constructor(clientRepository: Repository<Client>) {
        this.clientRepository = clientRepository;
    };

    async add(client: Client): Promise<Client> {
        client = await this.clientRepository.save(client);
    
        return client;
    };
    
    async getMany(skip: number, take: number, _page: number): Promise<[Client[], number]> {
        const [clients, total] = await this.clientRepository.findAndCount({
            relations: {
                orders: {
                    items: {
                        product: true,
                        service: true,
                    }
                }
            },
            skip,
            take
        });
        
        return [clients, total];
    };

    async getBySpending(): Promise<Client[]> {
        const clients = await this.clientRepository.find({
            relations: {
                orders: {
                    items: {
                        product: true,
                        service: true,
                    }
                }
            }
        });
        
        return clients;
    };

    async getById(id: number): Promise<Client> {
        const client = await this.clientRepository.findOneBy({
            id
        });
    
        return client;
    };

    async updateById(newClientData: Client): Promise<Client> {
        const updatedClient = await this.clientRepository.save(newClientData);

        return updatedClient;
    };

    async deleteById(id: number): Promise<DeleteResult> {
        const deletedRow = await this.clientRepository.delete({
            id
        });

        return deletedRow;
    };
};

export default ClientRepository;