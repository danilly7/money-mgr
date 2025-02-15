import { Request, Response } from 'express';
import models from '../models';

const { User } = models;

//IMPORTANTE: gets y post están sin restringir
//solo update está restringido en este moment
//no tiene delete por el momento

export const getAllUsers = async (req: Request, res: Response): Promise<void> => { //este al llamar llamamos a todos
    try {
        const result = await User.findAndCountAll();
        res.json({ count: result.count, users: result.rows }); //tmb puede ser res.json({ data: result }) pero todo junta la info
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ups, there was an error when trying to get all the users',
        });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
   
    if (isNaN(Number(id))) {
        res.status(400).json({ msg: 'Invalid user ID' });
        return;
    }

    try {
        const user = await User.findByPk(id);

        if (!user) {
            res.status(404).json({ msg: `User with id ${id} does NOT exist (yet)` });
            return;
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ups, there was an error when trying to get the user',
        });
    }
};

export const postUser = async (req: Request, res: Response): Promise<void> => {
    const { name, email, uid } = req.body;
    
    if (!name || !email || !uid) {
        res.status(400).json({ msg: 'All fields are required' });
        return;
    }

    try {
        const existingUser = await User.findOne({ where: { uid } });

        if (existingUser) {
            res.status(409).json({ msg: 'User already exists' });
            return;
        }

        const user = await User.create({ name, email, uid });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ups, there was an error when trying to create the user',
        });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, email } = req.body;
    const user_id = req.user?.id; //el único que tiene auth pq solo el mismo user puede hacerlo.

    if (!user_id) {
        res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
        return;
    }

    if (!name && !email) {
        res.status(400).json({ msg: 'At least one field is required to update' });
        return;
    }

    try {
        const user = await User.findByPk(id);

        if (!user) {
            res.status(404).json({
                msg: `User with id ${id} not found`,
            });
            return;
        }

        if (user_id !== user.id) {
            res.status(403).json({ msg: 'Forbidden: You can only update your own account' });
            return;
        }

        await user.update({ name, email });

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ups, there was an error when trying to update the user',
        });
    }
};