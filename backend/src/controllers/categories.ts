import { Request, Response } from 'express';
import models from '../models';

const { Category } = models;

//vamos a hacer las categorías iguales para todos, no tan personalizables por el momento
//no habrá user auth, pq todos tenemos las mismas categorías
//por lo tanto se comentan post, update y delete
//tmb las categorias estarán en intial data ya preestablecidas

export const getAllCategories = async (req: Request, res: Response): Promise<void> => { //pedimos todas, no hay paginación  
    try {
        const result = await Category.findAndCountAll();
        res.json({ count: result.count, users: result.rows }) 
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ups, there was an error when trying to get the categories' });
    }
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => { 
    const { id } = req.params;

    if (isNaN(Number(id))) {
        res.status(400).json({ msg: 'Invalid category ID' });
        return;
    }

    try {
        const category = await Category.findByPk(id);

        if (!category) {
            res.status(404).json({ msg: `Category with id ${id} not found` });
            return;
        }

        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ups, there was an error when trying to get the category' });
    }
};

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