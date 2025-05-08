/* eslint-disable no-unused-vars */
import Service from "../models/Service";
import { NextFunction, Request, Response } from "express";
import IRouter from "./Router";
import { DeleteResult } from "typeorm";

interface IServiceRepository {
  add(service: Service): Promise<Service>;
  getMany(skip: number, take: number, page: number): Promise<[Service[], Number]>;
  getById(id: number): Promise<Service>;
  updateById(newServiceData: Service): Promise<Service>;
  deleteById(id: number): Promise<DeleteResult>;
};

interface IServiceService {
  serviceRepository: IServiceRepository;

  add(service: Service): Promise<Service>;
  getMany(skip?: number, take?: number, page?: number): Promise<[Service[], Number]>;
  getById(id: number): Promise<Service>;
  updateById(service: Service, newServiceData: Service): Promise<Service>;
  deleteById(id: number): Promise<DeleteResult>;
};

interface IServiceController {
  serviceService: IServiceService;

  add(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  getMany(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  getById(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  updateById(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  deleteById(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
};

interface IServiceRouter extends IRouter {
  serviceController: IServiceController;
}

export {
  IServiceRepository,
  IServiceService,
  IServiceController,
  IServiceRouter
};