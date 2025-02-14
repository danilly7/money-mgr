import { Request, Response } from 'express';
import models from '../models';

const { User } = models;

//IMPORTANTE: gets y post están sin restringir. Solo update está restringido en este moment.

export const getUsers = async (req: Request, res: Response) => { //este al llamar llamamos a todos
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

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;
   
    if (isNaN(Number(id))) {
        return res.status(400).json({ msg: 'Invalid user ID' });
    }

    try {
        const user = await User.findByPk(id);

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({
                msg: `User with id ${id} does NOT exist (yet)`,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ups, there was an error when trying to get the user',
        });
    }
};

export const postUser = async (req: Request, res: Response) => {
    const { name, email, uid } = req.body;
    
    if (!name || !email || !uid) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    try {
        const user = await User.create({ name, email, uid });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ups, there was an error when trying to create the user',
        });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const user_id = req.user?.id; //el único que tiene auth pq solo el mismo user puede hacerlo.

    if (!user_id) {
        return res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
    }

    if (!name && !email) {
        return res.status(400).json({ msg: 'At least one field is required to update' });
    }

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                msg: `User with id ${id} not found`,
            });
        }

        if (user_id !== user.id) {
            return res.status(403).json({ msg: 'Forbidden: You can only update your own account' });
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

//este no tiene delete.