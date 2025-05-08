import { DeleteResult } from "typeorm";
import { IPetRepository, IPetService } from "../interfaces/PEt";
import Pet from "../models/Pet";
import { validationsUtils } from "../utils/Validation";

class PetService implements IPetService{
    petRepository: IPetRepository

    constructor(petRepository: IPetRepository) {
        this.petRepository = petRepository;
    };

    async add(pet: Pet): Promise<Pet> {
        await validationsUtils.validateObject(Pet, pet);
        pet = await this.petRepository.add(pet);

        return pet;
    };

    async getMany(skip: number=0, take: number=10, page: number=1): Promise<[Pet[], Number]> {
        const [pets, total] = await this.petRepository.getMany(skip, take, page);

        return [pets, total];
    };

    async getById(id: number): Promise<Pet> {
        const pet = await this.petRepository.getById(id);

        return pet;
    };

    async updateById(pet: Pet, newPetData: Pet): Promise<Pet> {
        Object.assign(pet, newPetData);

        await validationsUtils.validateObject(Pet, pet);
        const updatedPet = await this.petRepository.updateById(pet);

        return updatedPet;
    };

    async deleteById(id: number): Promise<DeleteResult> {
        const deletedRow = await this.petRepository.deleteById(id);

        return deletedRow;
    }
};

export default PetService;
