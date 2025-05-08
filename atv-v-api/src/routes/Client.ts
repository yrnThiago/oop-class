import { Router } from "express";
import { IClientController } from "../interfaces/Client";

class ClientRouter {
  path: string = "/clients";
  clientController: IClientController;

  constructor(clientController: IClientController) {
    this.clientController = clientController;
  }

  getRouter(): Router {
    const router: Router = Router();

    router
      .route(`${this.path}/topSpending/10`)
      .get(this.clientController.getBySpending)
    
    router
      .route(`${this.path}/topProductBuyer/10`)
      .get(this.clientController.getByProductQuantity)

    router
      .route(`${this.path}/topServiceBuyer/10`)
      .get(this.clientController.getByServiceQuantity)

    router
      .route(`${this.path}`)
      .post(this.clientController.add)

    router
      .route(`${this.path}/:id`)
      .get(this.clientController.getById)
      .put(this.clientController.updateById)
      .delete(this.clientController.deleteById)
    
    router
      .route(`${this.path}/:take?/:page?`)
      .get(this.clientController.getMany);
    
    

    return router;
    
  }
}

export default ClientRouter;