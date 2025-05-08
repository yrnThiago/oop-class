import { NextFunction, Request, Response, Router } from "express";
import { IAuthController, IAuthService } from "../interfaces/Auth";
import HttpStatus from 'http-status-codes';
import { cookieUtils } from './../utils/Cookie';
import { emailUtils } from "../utils/Email";
import AuthRouter from "../routes/Auth";

class AuthController implements IAuthController {
    authService: IAuthService;

    constructor(authService: IAuthService) {
        this.authService = authService;

        this.login = this.login.bind(this);
        this.loginByMagicLink = this.loginByMagicLink.bind(this);
        this.logout = this.logout.bind(this);
    };

    async login(req: Request, res: Response, next: NextFunction): Promise<void | Response> {    
      try {
        const login = req.body;
        if (!login.email) return res.status(HttpStatus.BAD_REQUEST).json({ error: "login is missing" });
      
        const user = await this.authService.getUserByLogin(login);
        if (!user) return res.status(HttpStatus.UNAUTHORIZED).json({ error: "invalid credentials" });
  
        const token = this.authService.generateToken(user);

        cookieUtils.setCookie(res, process.env.COOKIE_NAME, token);

        return res.status(HttpStatus.OK).json({role: user.role});
      } catch (error) {
        return next(error);
      }
    }

    async loginByMagicLink(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
      try {
        const token = req.params["token"];
        if (!token) return res.status(HttpStatus.BAD_REQUEST).json({ error: "token is missing" });

        cookieUtils.setCookie(res, process.env.COOKIE_NAME, token);

        return res.status(HttpStatus.OK).json({ message: "login successful" });
      } catch (error) {
          return next(error);
      }
    }

    async logout(_req: Request, res: Response, _next: NextFunction): Promise<void | Response> {
      return res.clearCookie(process.env.COOKIE_NAME).status(HttpStatus.OK).json({ message: "logout successfully"});
    };
};

export default AuthController;