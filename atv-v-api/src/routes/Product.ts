import { Router } from "express";
import { IProductController } from "../interfaces/Product";

class ProductRouter {
  path: string = "/products";
  productController: IProductController;

  constructor(productController: IProductController) {
    this.productController = productController;
  }

  getRouter(): Router {
    const router: Router = Router();

    router
      .route(`${this.path}`)
      .post(this.productController.add)

    router
      .route(`${this.path}/:id`)
      .get(this.productController.getById)
      .put(this.productController.updateById)
      .delete(this.productController.deleteById)
    
    router
      .route(`${this.path}/:take?/:page?`)
      .get(this.productController.getMany);

    return router;
    
  }
}

export default ProductRouter;