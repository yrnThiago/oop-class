import { DeleteResult } from "typeorm";
import { IServiceRepository, IServiceService } from "../interfaces/Service";
import Service from "../models/Service";
import { validationsUtils } from "../utils/Validation";

class ServiceService implements IServiceService{
    serviceRepository: IServiceRepository

    constructor(serviceRepository: IServiceRepository) {
        this.serviceRepository = serviceRepository;
    };

    async add(service: Service): Promise<Service> {
        await validationsUtils.validateObject(Service, service);
        service = await this.serviceRepository.add(service);

        return service;
    };

    async getMany(skip: number=0, take: number=10, page: number=1): Promise<[Service[], Number]> {
        const [services, total] = await this.serviceRepository.getMany(skip, take, page);

        return [services, total];
    };

    async getById(id: number): Promise<Service> {
        const service = await this.serviceRepository.getById(id);

        return service;
    };

    async updateById(service: Service, newServiceData: Service): Promise<Service> {
        Object.assign(service, newServiceData);

        await validationsUtils.validateObject(Service, service);
        const updatedService = await this.serviceRepository.updateById(service);

        return updatedService;
    };

    async deleteById(id: number): Promise<DeleteResult> {
        const deletedRow = await this.serviceRepository.deleteById(id);

        return deletedRow;
    }
};

export default ServiceService;
