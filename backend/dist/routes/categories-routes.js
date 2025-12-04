"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_1 = require("../controllers/categories");
// import { authUser } from '../middlewares/auth.middleware';
const categoriesRouter = (0, express_1.Router)();
// categoriesRouter.use(authUser); en este momento no hago el paso de auth para categorias.
categoriesRouter.get("/", categories_1.getAllCategories);
categoriesRouter.get("/:id", categories_1.getCategoryById);
exports.default = categoriesRouter;
