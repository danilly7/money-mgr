import { Request, Response } from 'express';
import models from '../models';

const { Category } = models;

export const getCategories = async (req: Request, res: Response) => { //pedimos todas, no hay paginación
    try {
        const categories = await Category.findAll();

        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ups, there was an error when trying to get the categories' });
    }
};

export const getCategory = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (isNaN(Number(id))) {
        return res.status(400).json({ msg: 'Invalid category ID' });
    }

    try {
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ msg: `Category with id ${id} not found` });
        }

        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ups, there was an error when trying to get the category' });
    }
};

export const postCategory = async (req: Request, res: Response) => {
    const { name, type } = req.body;

    if (!name || !type) {
        return res.status(400).json({ msg: 'Name and type are required' });
    }

    try {
        const category = await Category.create({ name, type });
        res.status(201).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ups, there was an error when trying to create the category' });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, type } = req.body;

    if (!name && !type) {
        return res.status(400).json({ msg: 'At least one field (name or type) is required to update' });
    }

    try {
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ msg: `Category with id ${id} not found` });
        }

        category.set({ name, type });

        await category.save();
        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ups, there was an error when trying to update the category' });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ msg: `Category with id ${id} not found` });
        }

        await category.destroy();
        res.json({ msg: 'Category deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ups, there was an error when trying to delete the category' });
    }
};