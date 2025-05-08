import { IPetRepository } from "../interfaces/PEt";
import Pet from "../models/Pet";
import { DeleteResult, In, Repository } from "typeorm";

class PetRepository implements IPetRepository {
    petRepository: Repository<Pet>;

    constructor(petRepository: Repository<Pet>) {
        this.petRepository = petRepository;
    };

    async add(pet: Pet): Promise<Pet> {
        pet = await this.petRepository.save(pet);
    
        return pet;
    };
    
    async getMany(skip: number, take: number, _page: number): Promise<[Pet[], number]> {
        const [pets, total] = await this.petRepository.findAndCount({
            relations: {
                client: true
            },
            skip,
            take
        });
        
        return [pets, total];
    };

    async getById(id: number): Promise<Pet> {
        const pet = await this.petRepository.findOneBy({
            id
        });
    
        return pet;
    };

    async updateById(newPetData: Pet): Promise<Pet> {
        const updatedPet = await this.petRepository.save(newPetData);

        return updatedPet;
    };

    async deleteById(id: number): Promise<DeleteResult> {
        const deletedRow = await this.petRepository.delete({
            id
        });

        return deletedRow;
    };
};

export default PetRepository;