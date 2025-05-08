/* eslint-disable no-unused-vars */
import Client from "../models/Client";
import { NextFunction, Request, Response } from "express";
import IRouter from "./Router";
import { DeleteResult } from "typeorm";

interface IClientRepository {
  add(client: Client): Promise<Client>;
  getMany(skip: number, take: number, page: number): Promise<[Client[], Number]>;
  getById(id: number): Promise<Client>;
  getBySpending(): Promise<Client[]>;
  updateById(newClientData: Client): Promise<Client>;
  deleteById(id: number): Promise<DeleteResult>;
};

interface IClientService {
  clientRepository: IClientRepository;

  add(client: Client): Promise<Client>;
  getMany(skip?: number, take?: number, page?: number): Promise<[Client[], Number]>;
  getById(id: number): Promise<Client>;
  getBySpending(): Promise<Client[]>;
  getByProductQuantity(): Promise<Client[]>;
  getByServiceQuantity(): Promise<Client[]>;
  updateById(client: Client, newClientData: Client): Promise<Client>;
  deleteById(id: number): Promise<DeleteResult>;
};

interface IClientController {
  clientService: IClientService;

  add(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  getMany(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  getById(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  getBySpending(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  getByProductQuantity(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  getByServiceQuantity(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  updateById(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  deleteById(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
};

interface IClientRouter extends IRouter {
  clientController: IClientController;
}

export {
  IClientRepository,
  IClientService,
  IClientController,
  IClientRouter
};