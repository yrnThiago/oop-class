/* eslint-disable no-unused-vars */
import Pet from "../models/Pet";
import { NextFunction, Request, Response } from "express";
import IRouter from "./Router";
import { DeleteResult } from "typeorm";

interface IPetRepository {
  add(pet: Pet): Promise<Pet>;
  getMany(skip: number, take: number, page: number): Promise<[Pet[], Number]>;
  getById(id: number): Promise<Pet>;
  updateById(newPetData: Pet): Promise<Pet>;
  deleteById(id: number): Promise<DeleteResult>;
};

interface IPetService {
  petRepository: IPetRepository;

  add(pet: Pet): Promise<Pet>;
  getMany(skip?: number, take?: number, page?: number): Promise<[Pet[], Number]>;
  getById(id: number): Promise<Pet>;
  updateById(pet: Pet, newPetData: Pet): Promise<Pet>;
  deleteById(id: number): Promise<DeleteResult>;
};

interface IPetController {
  petService: IPetService;

  add(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  getMany(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  getById(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  updateById(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  deleteById(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
};

interface IPetRouter extends IRouter {
  petController: IPetController;
}

export {
  IPetRepository,
  IPetService,
  IPetController,
  IPetRouter
};