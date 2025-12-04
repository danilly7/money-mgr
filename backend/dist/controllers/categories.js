"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryById = exports.getAllCategories = void 0;
const models_1 = __importDefault(require("../models"));
const { Category } = models_1.default;
//vamos a hacer las categorías iguales para todos, no tan personalizables por el momento
//no habrá user auth, pq todos tenemos las mismas categorías
//por lo tanto se comentan post, update y delete
//tmb las categorias estarán en intial data ya preestablecidas
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Category.findAndCountAll();
        res.json({ count: result.count, categories: result.rows });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ups, there was an error when trying to get the categories' });
    }
});
exports.getAllCategories = getAllCategories;
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        res.status(400).json({ msg: 'Invalid category ID' });
        return;
    }
    try {
        const category = yield Category.findByPk(id);
        if (!category) {
            res.status(404).json({ msg: `Category with id ${id} not found` });
            return;
        }
        res.json(category);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ups, there was an error when trying to get the category' });
    }
});
exports.getCategoryById = getCategoryById;
//OJO si se descomenta, añadir lo del void y mirar lo del return!
// export const postCategory = async (req: Request, res: Response) => {
//     const { name, type } = req.body;
//     if (!name || !type) {
//         return res.status(400).json({ msg: 'Name and type are required' });
//     }
//     try {
//         const category = await Category.create({ name, type });
//         res.status(201).json(category);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ msg: 'Ups, there was an error when trying to create the category' });
//     }
// };
// export const updateCategory = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const { name, type } = req.body;
//     if (!name && !type) {
//         return res.status(400).json({ msg: 'At least one field (name or type) is required to update' });
//     }
//     try {
//         const category = await Category.findByPk(id);
//         if (!category) {
//             return res.status(404).json({ msg: `Category with id ${id} not found` });
//         }
//         await category.update({ name, type });
//         res.json(category);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ msg: 'Ups, there was an error when trying to update the category' });
//     }
// };
// export const deleteCategory = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     try {
//         const category = await Category.findByPk(id);
//         if (!category) {
//             return res.status(404).json({ msg: `Category with id ${id} not found` });
//         }
//         await category.destroy();
//         res.json({ msg: 'Category deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ msg: 'Ups, there was an error when trying to delete the category' });
//     }
// };
