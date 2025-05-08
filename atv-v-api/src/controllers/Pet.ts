import Pet from "../models/Pet";
import { NextFunction, Request, Response } from "express";
import { IPetController, IPetService } from "../interfaces/PEt";
import HttpStatus from 'http-status-codes';

class PetController implements IPetController {
    petService: IPetService;

    constructor(petService: IPetService) {
        this.petService = petService;

        this.add = this.add.bind(this);
        this.getMany = this.getMany.bind(this);
        this.getById = this.getById.bind(this);
        this.updateById = this.updateById.bind(this);
        this.deleteById = this.deleteById.bind(this);
    };

    async add(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const pet = req.body;
            if(!pet.name) {
                return res.status(HttpStatus.BAD_REQUEST).json({message: "pet body missing"});
            };

            const newPet = await this.petService.add(pet);
            return res.status(HttpStatus.OK).json(newPet);
        } catch (error) {
            next(error);  
        };
    };

    async getMany(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const take = Number(req.query.take) || 10;
            const page = Number(req.query.page) || 1;
            const skip = (page-1) * take;

            const [pets, total] = await this.petService.getMany(skip, take, page);
            if (pets.length === 0) return res.status(HttpStatus.OK).json({message: "no pet was created"});

            return res.status(HttpStatus.OK).json({pets, total});
        } catch (error) {
            next(error);
        };
    };

    async getById(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            if(!id) return res.status(HttpStatus.BAD_REQUEST).json({message: "pet id missing"});
    
            const pet = await this.petService.getById(id);
            if(!pet) return res.status(HttpStatus.NOT_FOUND).json({message: "pet not found"});
    
            return res.status(HttpStatus.OK).json(pet);
        } catch (error) {
            next(error);
        };
        
    };
    async updateById(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            const id = parseInt(req.params.id);
            if(!id) return res.status(HttpStatus.BAD_REQUEST).json({message: "pet id missing"});
      
            const newPetData = req.body;
            if(!newPetData) return res.status(HttpStatus.BAD_REQUEST).json({message: "new pet body missing"});
      
            const pet = await this.petService.getById(id);
            if(!pet) return res.status(HttpStatus.NOT_FOUND).json({message: "pet not found"});
      
            const updatedPet = await this.petService.updateById(pet, newPetData);
      
            return res.status(HttpStatus.OK).json(updatedPet); 
        } catch (error) {
            next(error);
        };
    };

    async deleteById(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            const id = parseInt(req.params.id);
            if(!id) return res.status(HttpStatus.BAD_REQUEST).json({message: "pet id missing"});
    
            const deletedRow = await this.petService.deleteById(id);
            if(!deletedRow.affected) return res.status(HttpStatus.BAD_REQUEST).json({message: "pet not found"});
    
            return res.status(HttpStatus.OK).json({message: `pet id ${id} deleted`});
        } catch (error) {
            next(error);
        };
    };
};

export default PetController;