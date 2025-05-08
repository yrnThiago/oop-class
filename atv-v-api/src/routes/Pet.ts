import { Router } from "express";
import { IPetController } from "../interfaces/PEt";

class PetRouter {
  path: string = "/pets";
  petController: IPetController;

  constructor(petController: IPetController) {
    this.petController = petController;
  }

  getRouter(): Router {
    const router: Router = Router();

    router
      .route(`${this.path}`)
      .post(this.petController.add)

    router
      .route(`${this.path}/:id`)
      .get(this.petController.getById)
      .put(this.petController.updateById)
      .delete(this.petController.deleteById)
    
    router
      .route(`${this.path}/:take?/:page?`)
      .get(this.petController.getMany);

    return router;
    
  }
}

export default PetRouter;