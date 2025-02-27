import { Request, Response } from 'express';
import models from '../models';
import { Op, Sequelize } from 'sequelize';

const { Transfer, Account } = models;

export const getAllTransfers = async (req: Request, res: Response): Promise<void> => {
    const user_id = req.user?.id;

    if (!user_id) {
        res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
        return;
    }

    let { page = 1, limit = 10 } = req.query; //ojo aquí hay paginación

    page = Math.max(Number(page), 1);
    limit = Math.max(Number(limit), 1);

    const offset = (page - 1) * limit;

    try {
        const result = await Transfer.findAndCountAll({
            where: {
                [Op.or]: [ //ojo esto funciona pq es sequelize, si usamos otro hay que modificar cosis
                    { origin_account_id: { [Op.in]: Sequelize.literal(`(SELECT id FROM Accounts WHERE user_id = ${user_id})`) } },
                    { destination_account_id: { [Op.in]: Sequelize.literal(`(SELECT id FROM Accounts WHERE user_id = ${user_id})`) } }
                ]
            },
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

export const getTransferById = async (req: Request, res: Response): Promise<void> => { 
    const { id } = req.params;
    const user_id = req.user?.id;

    if (!user_id) {
        res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
        return;
    }

    if (isNaN(Number(id))) {
        res.status(400).json({ msg: 'Invalid transfer ID' });
        return;
    }

    try {
        const transfer = await Transfer.findOne({
            where: {
                id,
                [Op.or]: [ //ojo esto funciona pq es sequelize, si usamos otro hay que modificar cosis
                    { origin_account_id: { [Op.in]: Sequelize.literal(`(SELECT id FROM Accounts WHERE user_id = ${user_id})`) } },
                    { destination_account_id: { [Op.in]: Sequelize.literal(`(SELECT id FROM Accounts WHERE user_id = ${user_id})`) } }
                ]
            },
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

export const postTransfer = async (req: Request, res: Response): Promise<void> => { 
    const { amount, origin_account_id, destination_account_id, date, comment } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
        res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
        return;
    }

    if (!amount || !origin_account_id || !destination_account_id || origin_account_id === destination_account_id) {
        res.status(400).json({ msg: 'All fields except comment are required, and origin and destination must be different' });
        return;
    }

    if (typeof amount !== 'number' || amount <= 0) {
        res.status(400).json({ msg: 'Amount must be greater than 0' });
        return;
    }

    try {
        const originAccount = await models.Account.findByPk(origin_account_id);
        const destinationAccount = await models.Account.findByPk(destination_account_id);

        if (!originAccount || !destinationAccount) {
            res.status(404).json({ msg: 'One or both accounts do not exist' });
            return;
        }

        if (originAccount.user_id !== user_id || destinationAccount.user_id !== user_id) {
            res.status(403).json({ msg: 'Both accounts must belong to the authenticated user' });
            return;
        }

        if (originAccount.balance < amount) {
            res.status(400).json({ msg: 'Insufficient balance in the origin account' });
            return;
        }

        const transfer = await Transfer.create({ amount, origin_account_id, destination_account_id, date, comment });
       
        originAccount.balance -= amount;
        destinationAccount.balance += amount;

        await originAccount.save();
        await destinationAccount.save();

        res.json(transfer);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ups, there was an error when trying to create the transfer',
        });
    }
};

export const updateTransfer = async (req: Request, res: Response): Promise<void> => { 
    const { id } = req.params;
    const { amount, origin_account_id, destination_account_id, date, comment } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
        res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
        return;
    }

    if (!amount && !origin_account_id && !destination_account_id && !date) {
        res.status(400).json({ msg: 'At least one field is required to update' });
        return;
    }

    if (amount && (typeof amount !== 'number' || amount <= 0)) {
        res.status(400).json({ msg: 'Amount must be greater than 0' });
        return;
    }
    
    try {
        const transfer = await Transfer.findByPk(id);

        if (!transfer) {
            res.status(404).json({ msg: `Transfer with id ${id} does NOT exist` });
            return;
        }

        const originAccount = await Account.findByPk(origin_account_id || transfer.origin_account_id);
        const destinationAccount = await Account.findByPk(destination_account_id || transfer.destination_account_id);

        if (!originAccount || !destinationAccount) {
            res.status(404).json({ msg: 'One or both accounts do not exist' });
            return;
        }

        if (originAccount.user_id !== user_id || destinationAccount.user_id !== user_id) {
            res.status(403).json({ msg: 'Both accounts must belong to the authenticated user' });
            return;
        }

        //logica de revertir tranfe:
        originAccount.balance += transfer.amount; 
        destinationAccount.balance -= transfer.amount; 

        originAccount.balance -= amount || transfer.amount; 
        destinationAccount.balance += amount || transfer.amount; 

        if (originAccount.balance < 0) {
            res.status(400).json({ msg: 'Insufficient balance in the origin account' });
            return;
        }

        await originAccount.save();
        await destinationAccount.save();

        await transfer.update({ amount, origin_account_id, destination_account_id, date, comment });

        res.json(transfer);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ups, there was an error when trying to update the transfer',
        });
    }
};

export const deleteTransfer = async (req: Request, res: Response): Promise<void> => { 
    const { id } = req.params;
    const user_id = req.user?.id;

    if (!user_id) {
        res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
        return;
    }

    try {
        const transfer = await Transfer.findByPk(id);

        if (!transfer) {
            res.status(404).json({ msg: `Transfer with id ${id} does NOT exist` });
            return;
        }

        const originAccount = await models.Account.findByPk(transfer.origin_account_id);
        const destinationAccount = await models.Account.findByPk(transfer.destination_account_id);

        if (!originAccount || !destinationAccount) {
            res.status(404).json({ msg: 'One or both accounts do not exist' });
            return;
        }

        if (originAccount.user_id !== user_id || destinationAccount.user_id !== user_id) {
            res.status(403).json({ msg: 'Both accounts must belong to the authenticated user' });
            return;
        }

        //logica del balance accounts:
        originAccount.balance += transfer.amount;
        destinationAccount.balance -= transfer.amount;

        await originAccount.save();
        await destinationAccount.save();

        await transfer.destroy();

        res.json({ msg: `Transfer with id ${id} was deleted` });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ups, there was an error when trying to delete the transfer',
        });
    }
};