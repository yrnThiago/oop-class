import { IAuthService } from "../interfaces/Auth";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../interfaces/User";
import User from "../models/User";

class AuthService implements IAuthService {
  userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  generateToken(user: User): string {
    return jwt.sign({user}, process.env.SECRET_KEY, { expiresIn: process.env.COOKIE_EXPIRES_IN });
  }

  getUserByLogin(login: User): Promise<User> {
    return this.userRepository.getByLogin(login);
  }
}

export default AuthService;
