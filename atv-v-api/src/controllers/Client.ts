import Client from "../models/Client";
import { NextFunction, Request, Response } from "express";
import { IClientController, IClientService } from "../interfaces/Client";
import HttpStatus from 'http-status-codes';

class ClientController implements IClientController {
    clientService: IClientService;

    constructor(clientService: IClientService) {
        this.clientService = clientService;

        this.add = this.add.bind(this);
        this.getMany = this.getMany.bind(this);
        this.getById = this.getById.bind(this);
        this.getBySpending = this.getBySpending.bind(this);
        this.getByProductQuantity = this.getByProductQuantity.bind(this);
        this.getByServiceQuantity = this.getByServiceQuantity.bind(this);
        this.updateById = this.updateById.bind(this);
        this.deleteById = this.deleteById.bind(this);
    };

    async add(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const client = req.body;
            if(!client.name) {
                return res.status(HttpStatus.BAD_REQUEST).json({message: "client body missing"});
            };

            const newClient = await this.clientService.add(client);
            return res.status(HttpStatus.OK).json(newClient);
        } catch (error) {
            next(error);  
        };
    };

    async getMany(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const take = Number(req.query.take) || 10;
            const page = Number(req.query.page) || 1;
            const skip = (page-1) * take;

            const [clients, total] = await this.clientService.getMany(skip, take, page);
            if (clients.length === 0) return res.status(HttpStatus.OK).json({message: "no client was created"});

            return res.status(HttpStatus.OK).json({clients, total});
        } catch (error) {
            next(error);
        };
    };

    async getById(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            if(!id) return res.status(HttpStatus.BAD_REQUEST).json({message: "client id missing"});
    
            const client = await this.clientService.getById(id);
            if(!client) return res.status(HttpStatus.NOT_FOUND).json({message: "client not found"});
    
            return res.status(HttpStatus.OK).json(client);
        } catch (error) {
            next(error);
        };
        
    };

    async getBySpending(_req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const clients = await this.clientService.getBySpending();
            if(!clients) return res.status(HttpStatus.NOT_FOUND).json({message: "clients not found"});
    
            return res.status(HttpStatus.OK).json(clients);
        } catch (error) {
            next(error);
        };
        
    };

    async getByProductQuantity(_req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const clients = await this.clientService.getByProductQuantity();
            if(!clients) return res.status(HttpStatus.NOT_FOUND).json({message: "clients not found"});
    
            return res.status(HttpStatus.OK).json(clients);
        } catch (error) {
            next(error);
        };
        
    };

    async getByServiceQuantity(_req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const clients = await this.clientService.getByServiceQuantity();
            if(!clients) return res.status(HttpStatus.NOT_FOUND).json({message: "clients not found"});
    
            return res.status(HttpStatus.OK).json(clients);
        } catch (error) {
            next(error);
        };
        
    };

    async updateById(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            const id = parseInt(req.params.id);
            if(!id) return res.status(HttpStatus.BAD_REQUEST).json({message: "client id missing"});
      
            const newClientData = req.body;
            if(!newClientData) return res.status(HttpStatus.BAD_REQUEST).json({message: "new client body missing"});
      
            const client = await this.clientService.getById(id);
            if(!client) return res.status(HttpStatus.NOT_FOUND).json({message: "client not found"});
      
            const updatedClient = await this.clientService.updateById(client, newClientData);
      
            return res.status(HttpStatus.OK).json(updatedClient); 
        } catch (error) {
            next(error);
        };
    };

    async deleteById(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            const id = parseInt(req.params.id);
            if(!id) return res.status(HttpStatus.BAD_REQUEST).json({message: "client id missing"});
    
            const deletedRow = await this.clientService.deleteById(id);
            if(!deletedRow.affected) return res.status(HttpStatus.BAD_REQUEST).json({message: "client not found"});
    
            return res.status(HttpStatus.OK).json({message: `client id ${id} deleted`});
        } catch (error) {
            next(error);
        };
    };
};

export default ClientController;