import Service from "../models/Service";
import { NextFunction, Request, Response } from "express";
import { IServiceController, IServiceService } from "../interfaces/Service";
import HttpStatus from 'http-status-codes';

class ServiceController implements IServiceController {
    serviceService: IServiceService;

    constructor(serviceService: IServiceService) {
        this.serviceService = serviceService;

        this.add = this.add.bind(this);
        this.getMany = this.getMany.bind(this);
        this.getById = this.getById.bind(this);
        this.updateById = this.updateById.bind(this);
        this.deleteById = this.deleteById.bind(this);
    };

    async add(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const service = req.body;
            if(!service.name) {
                return res.status(HttpStatus.BAD_REQUEST).json({message: "service body missing"});
            };

            const newService = await this.serviceService.add(service);
            return res.status(HttpStatus.OK).json(newService);
        } catch (error) {
            next(error);  
        };
    };

    async getMany(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const take = Number(req.query.take) || 10;
            const page = Number(req.query.page) || 1;
            const skip = (page-1) * take;

            const [services, total] = await this.serviceService.getMany(skip, take, page);
            if (services.length === 0) return res.status(HttpStatus.OK).json({message: "no service was created"});

            return res.status(HttpStatus.OK).json({services, total});
        } catch (error) {
            next(error);
        };
    };

    async getById(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            if(!id) return res.status(HttpStatus.BAD_REQUEST).json({message: "service id missing"});
    
            const service = await this.serviceService.getById(id);
            if(!service) return res.status(HttpStatus.NOT_FOUND).json({message: "service not found"});
    
            return res.status(HttpStatus.OK).json(service);
        } catch (error) {
            next(error);
        };
        
    };
    async updateById(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            const id = parseInt(req.params.id);
            if(!id) return res.status(HttpStatus.BAD_REQUEST).json({message: "service id missing"});
      
            const newServiceData = req.body;
            if(!newServiceData) return res.status(HttpStatus.BAD_REQUEST).json({message: "new service body missing"});
      
            const service = await this.serviceService.getById(id);
            if(!service) return res.status(HttpStatus.NOT_FOUND).json({message: "service not found"});
      
            const updatedService = await this.serviceService.updateById(service, newServiceData);
      
            return res.status(HttpStatus.OK).json(updatedService); 
        } catch (error) {
            next(error);
        };
    };

    async deleteById(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            const id = parseInt(req.params.id);
            if(!id) return res.status(HttpStatus.BAD_REQUEST).json({message: "service id missing"});
    
            const deletedRow = await this.serviceService.deleteById(id);
            if(!deletedRow.affected) return res.status(HttpStatus.BAD_REQUEST).json({message: "service not found"});
    
            return res.status(HttpStatus.OK).json({message: `service id ${id} deleted`});
        } catch (error) {
            next(error);
        };
    };
};

export default ServiceController;