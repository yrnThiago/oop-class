import ProductController from "../../controllers/Product";
import Product from "../../models/Product";
import ormconfig from "../../ormconfig";
import ProductRepository from "../../repositories/Product";
import ProductRouter from "../../routes/Product";
import ProductService from "../../services/Product";

const productRepository = new ProductRepository(ormconfig.getRepository(Product));
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);
const productRouter = new ProductRouter(productController);

export default productRouter.getRouter();