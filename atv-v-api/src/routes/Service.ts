import { Router } from "express";
import { IServiceController } from "../interfaces/Service";

class ServiceRouter {
  path: string = "/services";
  serviceController: IServiceController;

  constructor(serviceController: IServiceController) {
    this.serviceController = serviceController;
  }

  getRouter(): Router {
    const router: Router = Router();

    router
      .route(`${this.path}`)
      .post(this.serviceController.add)

    router
      .route(`${this.path}/:id`)
      .get(this.serviceController.getById)
      .put(this.serviceController.updateById)
      .delete(this.serviceController.deleteById)
    
    router
      .route(`${this.path}/:take?/:page?`)
      .get(this.serviceController.getMany);

    return router;
    
  }
}

export default ServiceRouter;