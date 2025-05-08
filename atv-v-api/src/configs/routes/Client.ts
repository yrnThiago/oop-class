import ClientController from "../../controllers/Client";
import Client from "../../models/Client";
import ormconfig from "../../ormconfig";
import ClientRepository from "../../repositories/Client";
import ClientRouter from "../../routes/Client";
import ClientService from "../../services/Client";

const clientRepository = new ClientRepository(ormconfig.getRepository(Client));
const clientService = new ClientService(clientRepository);
const clientController = new ClientController(clientService);
const clientRouter = new ClientRouter(clientController);

export default clientRouter.getRouter();