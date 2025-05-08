import { DeleteResult } from "typeorm";
import { IClientRepository, IClientService } from "../interfaces/Client";
import Client from "../models/Client";
import { validationsUtils } from "../utils/Validation";

class ClientService implements IClientService{
    clientRepository: IClientRepository

    constructor(clientRepository: IClientRepository) {
        this.clientRepository = clientRepository;
    };

    async add(client: Client): Promise<Client> {
        await validationsUtils.validateObject(Client, client);
        client = await this.clientRepository.add(client);

        return client;
    };

    async getMany(skip: number=0, take: number=10, page: number=1): Promise<[Client[], Number]> {
        const [clients, total] = await this.clientRepository.getMany(skip, take, page);

        return [clients, total];
    };

    async getById(id: number): Promise<Client> {
        const client = await this.clientRepository.getById(id);

        return client;
    };

    async getBySpending(): Promise<Client[]> {
        const clients = await this.clientRepository.getBySpending();

        const clientsWithSpending = clients.map(client => {
            let totalSpent = 0;

            client.orders.forEach(order => {
                order.items.forEach(item => {
                    let itemTotal = 0;

                    if (item.product) {
                        itemTotal = item.product.price * item.quantity;
                    } else if (item.service) {
                        itemTotal = item.service.price * item.quantity;
                    }

                    totalSpent += itemTotal;
                });
            });

            client['totalSpent'] = totalSpent;
            return client;
        });

        clientsWithSpending.sort((a, b) => b['totalSpent'] - a['totalSpent']);
        return clientsWithSpending;
    };

    async getByProductQuantity(): Promise<Client[]> {
        const clients = await this.clientRepository.getBySpending();

        const clientsWithProductQuantity = clients.map(client => {
            let totalProductsBought = 0;

            client.orders.forEach(order => {
                order.items.forEach(item => {
                    if (item.product) {
                        totalProductsBought += item.quantity;
                    }
                });
            });

            client['totalProductsBought'] = totalProductsBought;
            return client;
        });

        clientsWithProductQuantity.sort((a, b) => b['totalProductsBought'] - a['totalProductsBought']);
        return clientsWithProductQuantity;
    }

    async getByServiceQuantity(): Promise<Client[]> {
        const clients = await this.clientRepository.getBySpending();

        const clientsWithServiceQuantity = clients.map(client => {
            let totalServicesBought = 0;

            client.orders.forEach(order => {
                order.items.forEach(item => {
                    if (item.service) {
                        totalServicesBought += item.quantity;
                    }
                });
            });

            client['totalServicesBought'] = totalServicesBought;
            return client;
        });

        clientsWithServiceQuantity.sort((a, b) => b['totalServicesBought'] - a['totalServicesBought']);
        return clientsWithServiceQuantity;
    }

    async updateById(client: Client, newClientData: Client): Promise<Client> {
        Object.assign(client, newClientData);

        await validationsUtils.validateObject(Client, client);
        const updatedClient = await this.clientRepository.updateById(client);

        return updatedClient;
    };

    async deleteById(id: number): Promise<DeleteResult> {
        const deletedRow = await this.clientRepository.deleteById(id);

        return deletedRow;
    }
};

export default ClientService;
