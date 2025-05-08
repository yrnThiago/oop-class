import ServiceController from "../../controllers/Service";
import Service from "../../models/Service";
import ormconfig from "../../ormconfig";
import ServiceRepository from "../../repositories/Service";
import ServiceRouter from "../../routes/Service";
import ServiceService from "../../services/Service";

const serviceRepository = new ServiceRepository(ormconfig.getRepository(Service));
const serviceService = new ServiceService(serviceRepository);
const serviceController = new ServiceController(serviceService);
const serviceRouter = new ServiceRouter(serviceController);

export default serviceRouter.getRouter();