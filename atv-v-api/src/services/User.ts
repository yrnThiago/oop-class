import { DeleteResult } from "typeorm";
import { IUserRepository, IUserService } from "../interfaces/User";
import User from "../models/User";
import { validationsUtils } from "../utils/Validation";

class UserService implements IUserService{
    userRepository: IUserRepository

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    };

    async add(user: User): Promise<User> {
        await validationsUtils.validateObject(User, user);
        user = await this.userRepository.add(user);

        return user;
    };

    async getMany(skip: number=0, take: number=10, page: number=1): Promise<[User[], Number]> {
        const [users, total] = await this.userRepository.getMany(skip, take, page);

        return [users, total];
    };

    async getByEmail(email: string): Promise<User> {
        const user = await this.userRepository.getByEmail(email);

        return user;
    };

    async getByLogin(login: User): Promise<User> {
        const user = await this.userRepository.getByLogin(login);
    
        return user;
    };

    async getById(id: number): Promise<User> {
        const user = await this.userRepository.getById(id);

        return user;
    };

    async getRoles(): Promise<string[]> {
        const roles = await this.userRepository.getRoles();

        return roles;
    };

    async updateById(user: User, newUserData: User): Promise<User> {
        Object.assign(user, newUserData);
        
        await validationsUtils.validateObject(User, user);
        const updatedUser = await this.userRepository.updateById(user);

        return updatedUser;
    };

    async deleteById(id: number): Promise<DeleteResult> {
        const deletedRow = await this.userRepository.deleteById(id);

        return deletedRow;
    }
};

export default UserService;
