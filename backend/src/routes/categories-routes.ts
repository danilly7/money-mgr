import { Router } from 'express';
import { getAllCategories, getCategoryById } from '../controllers/categories';
// import { authUser } from '../middlewares/auth.middleware';

const categoriesRouter = Router();

// categoriesRouter.use(authUser); en este momento no hago el paso de auth para categorias.

categoriesRouter.get("/", getAllCategories);
categoriesRouter.get("/:id", getCategoryById);

export default categoriesRouter;