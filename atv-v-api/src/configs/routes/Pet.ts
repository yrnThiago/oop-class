import PetController from "../../controllers/Pet";
import Pet from "../../models/Pet";
import ormconfig from "../../ormconfig";
import PetRepository from "../../repositories/Pet";
import PetRouter from "../../routes/Pet";
import PetService from "../../services/Pet";

const petRepository = new PetRepository(ormconfig.getRepository(Pet));
const petService = new PetService(petRepository);
const petController = new PetController(petService);
const petRouter = new PetRouter(petController);

export default petRouter.getRouter();