/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";
import IRouter from "./Router";
import User from "../models/User";
import { IUserRepository } from "./User";

interface IAuthService {
  userRepository: IUserRepository;

  generateToken(user: User): string;
  getUserByLogin(user: User): Promise<User>;
};

interface IAuthController {
  authService: IAuthService;

  login(req: Request, res: Response, next: NextFunction): Promise<void | Response>
  loginByMagicLink(req: Request, res: Response, next: NextFunction): Promise<void | Response>
  logout(req: Request, res: Response, next: NextFunction): Promise<void | Response>

};

interface IAuthRouter extends IRouter {
  authController: IAuthController;
}

export {
  IAuthService,
  IAuthController,
  IAuthRouter
};