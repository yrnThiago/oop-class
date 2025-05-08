import OrderController from "../../controllers/Order";
import Order from "../../models/Order";
import ormconfig from "../../ormconfig";
import OrderRepository from "../../repositories/Order";
import OrderRouter from "../../routes/Order";
import OrderService from "../../services/Order";

const orderRepository = new OrderRepository(ormconfig.getRepository(Order));
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);
const orderRouter = new OrderRouter(orderController);

export default orderRouter.getRouter();