import { IServiceRepository } from "../interfaces/Service";
import Service from "../models/Service";
import { DeleteResult, In, Repository } from "typeorm";

class ServiceRepository implements IServiceRepository {
    serviceRepository: Repository<Service>;

    constructor(serviceRepository: Repository<Service>) {
        this.serviceRepository = serviceRepository;
    };

    async add(service: Service): Promise<Service> {
        service = await this.serviceRepository.save(service);
    
        return service;
    };
    
    async getMany(skip: number, take: number, _page: number): Promise<[Service[], number]> {
        const [services, total] = await this.serviceRepository.findAndCount({
            skip,
            take
        });
        
        return [services, total];
    };

    async getById(id: number): Promise<Service> {
        const service = await this.serviceRepository.findOneBy({
            id
        });
    
        return service;
    };

    async updateById(newServiceData: Service): Promise<Service> {
        const updatedService = await this.serviceRepository.save(newServiceData);

        return updatedService;
    };

    async deleteById(id: number): Promise<DeleteResult> {
        const deletedRow = await this.serviceRepository.delete({
            id
        });

        return deletedRow;
    };
};

export default ServiceRepository;