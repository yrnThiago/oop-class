import { Router } from "express";
import { IOrderController } from "../interfaces/Order";

class OrderRouter {
  path: string = "/orders";
  orderController: IOrderController;

  constructor(orderController: IOrderController) {
    this.orderController = orderController;
  }

  getRouter(): Router {
    const router: Router = Router();

    router
      .route(`${this.path}`)
      .post(this.orderController.add)

    router
      .route(`${this.path}/topProducts`)
      .get(this.orderController.getByProductMostSold)
    
    router
      .route(`${this.path}/topServices`)
      .get(this.orderController.getByServiceMostSold)

    router
      .route(`${this.path}/:id`)
      .get(this.orderController.getById)
      .put(this.orderController.updateById)
      .delete(this.orderController.deleteById)
    
    router
      .route(`${this.path}/:take?/:page?`)
      .get(this.orderController.getMany);

    return router;
    
  }
}

export default OrderRouter;