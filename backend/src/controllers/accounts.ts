import { Request, Response } from "express";
import models from "../models";

const { Account, User } = models;

export const getAllAccounts = async (req: Request, res: Response): Promise<void> => {  //aquí pillo todos, no hay paginación
    const authenticatedUserId = req.user?.id;

    if (!authenticatedUserId) {
        res.status(401).json({ message: "Unauthorized: No user authenticated" });
        return;    
    }

    try {
        const result = await Account.findAndCountAll({
            where: { user_id: authenticatedUserId }, //solo puedo ver los accounts de mi user
            include: [{ model: User, as: "user" }], 
        });

        if (result.count === 0) {
            res.status(404).json({ message: "No accounts found for this user" });
            return;
        }

        res.json({
            count: result.count,
            accounts: result.rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ups, there was an error when trying to get the accounts" });
    }
};

export const getAccountById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const authenticatedUserId = req.user?.id;

    if (!authenticatedUserId) {
        res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
        return;
    }

    if (isNaN(Number(id))) {
        res.status(400).json({ msg: 'Invalid account ID' });
        return;
    }

    try {
        const account = await Account.findOne({
            where: { id, user_id: authenticatedUserId },
            include: [{ model: User, as: "user" }],
        });

        if (!account) {
            res.status(404).json({ message: "Account not found" });
            return;
        }

        res.json(account);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ups, there was an error when trying to get the account" });
    }
};

export const postAccount = async (req: Request, res: Response): Promise<void> => {
    const { name, balance, visibility, user_id } = req.body;
    const authenticatedUserId = req.user?.id;

    if (!authenticatedUserId) {
        res.status(401).json({ message: "Unauthorized: No user authenticated" });
        return;
    }

    if (user_id !== authenticatedUserId) {
        res.status(403).json({ message: "Forbidden: You cannot create an account for another user" });
        return;
    }
    
    if (!name || user_id === undefined) {
        res.status(400).json({ message: "Name and user_id are required" });
        return;
    }
    
    try {
        const newAccount = await Account.create({ name, balance, visibility, user_id });
        res.status(201).json(newAccount);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ups, there was an error when trying to create the account" });
    }
};

export const updateAccount = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, balance, visibility } = req.body; //id_user no lo ponemos en el req body pq así no hay opción de update
    const authenticatedUserId = req.user?.id;

    if (!authenticatedUserId) {
        res.status(401).json({ message: "Unauthorized: No user authenticated" });
        return;
    }

    if (!name && !balance && !visibility) {
        res.status(400).json({ msg: 'At least one field is required to update' });
        return;
    }

    try {
        const account = await Account.findByPk(id, { include: [{ model: User, as: "user" }] });
        if (!account) {
            res.status(404).json({ message: `Account with id ${id} not found` });
            return;
        }

        if (account.user_id !== authenticatedUserId) {
            res.status(403).json({ message: "Forbidden: You can only update your own accounts" });
            return;
        }

        await account.update({ name, balance, visibility }); //no user_id pq no quiero que se pueda update

        res.json(account);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ups, there was an error when trying to update the account" });
    }
};

export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const authenticatedUserId = req.user?.id;

    if (!authenticatedUserId) {
        res.status(401).json({ message: "Unauthorized: No user authenticated" });
        return;
    }

    try {
        const account = await Account.findByPk(id, { include: [{ model: User, as: "user" }] });

        if (!account) {
            res.status(404).json({ message: `Account with id ${id} not found` });
            return;
        }

        if (account.user_id !== authenticatedUserId) {
            res.status(403).json({ message: "Forbidden: You can only delete your own accounts" });
            return;
        }

        await account.destroy();
        res.json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ups, there was an error when trying to delete the account" });
    }
};