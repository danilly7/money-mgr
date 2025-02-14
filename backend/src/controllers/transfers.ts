import { Request, Response } from 'express';
import models from '../models';

const { Transfer, Account } = models;

export const getTransfers = async (req: Request, res: Response) => {
    const user_id = req.user?.id;

    if (!user_id) {
        return res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
    }

    let { page = 1, limit = 10 } = req.query; //ojo aquí hay paginación

    page = Math.max(Number(page), 1);
    limit = Math.max(Number(limit), 1);

    const offset = (page - 1) * limit;

    try {
        const result = await Transfer.findAndCountAll({
            limit,
            offset,
            include: [
                {
                    model: Account,
                    as: 'originAccount',
                    attributes: ['id', 'name', 'balance'],
                },
                {
                    model: Account,
                    as: 'destinationAccount',
                    attributes: ['id', 'name', 'balance'],
                },
            ],
        });

        res.json({
            total: result.count,
            totalPages: Math.ceil(result.count / limit),
            currentPage: page,
            transfers: result.rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ups, there was an error when trying to get the transfers',
        });
    }
};

export const getTransfer = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user_id = req.user?.id;

    if (!user_id) {
        return res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
    }

    if (isNaN(Number(id))) {
        return res.status(400).json({ msg: 'Invalid transfer ID' });
    }

    try {
        const transfer = await Transfer.findByPk(id, {
            include: [
                {
                    model: Account,
                    as: 'originAccount',
                    attributes: ['id', 'name', 'balance'],
                    where: { user_id }
                },
                {
                    model: Account,
                    as: 'destinationAccount',
                    attributes: ['id', 'name', 'balance'],
                    where: { user_id }
                },
            ],
        });

        if (transfer) {
            res.json(transfer);
        } else {
            res.status(404).json({
                msg: `Transfer with id ${id} does NOT exist`,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ups, there was an error when trying to get the transfer',
        });
    }
};

export const postTransfer = async (req: Request, res: Response) => {
    const { amount, origin_account_id, destination_account_id, date, comment } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
        return res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
    }

    if (!amount || !origin_account_id || !destination_account_id || origin_account_id === destination_account_id) {
        return res.status(400).json({ msg: 'All fields except comment are required, and origin and destination must be different' });
    }

    if (amount <= 0) {
        return res.status(400).json({ msg: 'Amount must be greater than 0' });
    }

    try {
        const originAccount = await models.Account.findByPk(origin_account_id);
        const destinationAccount = await models.Account.findByPk(destination_account_id);

        if (!originAccount || !destinationAccount) {
            return res.status(404).json({ msg: 'One or both accounts do not exist' });
        }

        if (originAccount.user_id !== user_id || destinationAccount.user_id !== user_id) {
            return res.status(403).json({ msg: 'Both accounts must belong to the authenticated user' });
        }

        const transfer = await Transfer.create({ amount, origin_account_id, destination_account_id, date, comment });
       
        res.json(transfer);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ups, there was an error when trying to create the transfer',
        });
    }
};

export const updateTransfer = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { amount, origin_account_id, destination_account_id, date, comment } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
        return res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
    }

    if (!amount && !origin_account_id && !destination_account_id && !date) {
        return res.status(400).json({ msg: 'At least one field is required to update' });
    }

    if (amount && amount <= 0) {
        return res.status(400).json({ msg: 'Amount must be greater than 0' });
    }
    
    try {
        const transfer = await Transfer.findByPk(id);

        if (!transfer) {
            return res.status(404).json({ msg: `Transfer with id ${id} does NOT exist` });
        }

        if (origin_account_id || destination_account_id) {
            const originAccount = await models.Account.findByPk(origin_account_id || transfer.origin_account_id);
            const destinationAccount = await models.Account.findByPk(destination_account_id || transfer.destination_account_id);

            if (!originAccount || !destinationAccount) {
                return res.status(404).json({ msg: 'One or both accounts do not exist' });
            }

            if (originAccount.user_id !== user_id || destinationAccount.user_id !== user_id) {
                return res.status(403).json({ msg: 'Both accounts must belong to the authenticated user' });
            }
        }

        await transfer.update({ amount, origin_account_id, destination_account_id, date, comment });

        res.json(transfer);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ups, there was an error when trying to update the transfer',
        });
    }
};

export const deleteTransfer = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user_id = req.user?.id;

    if (!user_id) {
        return res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
    }

    try {
        const transfer = await Transfer.findByPk(id);

        if (!transfer) {
            return res.status(404).json({ msg: `Transfer with id ${id} does NOT exist` });
        }

        const originAccount = await models.Account.findByPk(transfer.origin_account_id);
        const destinationAccount = await models.Account.findByPk(transfer.destination_account_id);

        if (!originAccount || !destinationAccount) {
            return res.status(404).json({ msg: 'One or both accounts do not exist' });
        }

        if (originAccount.user_id !== user_id || destinationAccount.user_id !== user_id) {
            return res.status(403).json({ msg: 'Both accounts must belong to the authenticated user' });
        }

        await transfer.destroy();
        res.json({ msg: `Transfer with id ${id} was deleted` });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ups, there was an error when trying to delete the transfer',
        });
    }
};