import { Request, Response } from 'express';
import models from '../models';

const { Transaction, Category, Account } = models;

export const getTransactions = async (req: Request, res: Response) => {
    const user_id = req.user?.id;

    if (!user_id) {
        return res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
    }

    let { page = 1, limit = 10 } = req.query; //ojo paginación

    page = Math.max(Number(page), 1);
    limit = Math.max(Number(limit), 1);

    const offset = (page - 1) * limit;

    try {
        const result = await Transaction.findAndCountAll({
            limit,
            offset,
            include: [
                {
                    model: Category,
                    attributes: ['id_category', 'name', 'type'],
                },
                {
                    model: Account,
                    attributes: ['id_account', 'name', 'balance'],
                    where: { user_id }, 
                },
            ],
        });

        res.json({
            total: result.count,
            totalPages: Math.ceil(result.count / limit),
            currentPage: page,
            transactions: result.rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ups, there was an error when trying to get the transactions' });
    }
};

export const getTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user_id = req.user?.id;

    if (!user_id) {
        return res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
    }

    if (isNaN(Number(id))) {
        return res.status(400).json({ msg: 'Invalid transaction ID' });
    }

    try {
        const transaction = await Transaction.findByPk(id, {
            include: [
                {
                    model: Category,
                    attributes: ['id_category', 'name', 'type'],
                },
                {
                    model: Account,
                    attributes: ['id_account', 'name', 'balance'],
                    where: { user_id },
                },
            ],
        });

        if (!transaction) {
            return res.status(404).json({ msg: `Transaction with id ${id} not found` });
        }

        res.json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ups, there was an error when trying to get the transfer' });
    }
};

export const postTransaction = async (req: Request, res: Response) => {
    const { amount, account_id, category_id, date, comment } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
        return res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
    }

    if (!amount || !account_id || !category_id || !date) {
        return res.status(400).json({ msg: 'All fields except comment are required' });
    }

    if (amount <= 0) {
        return res.status(400).json({ msg: 'Amount must be greater than 0' });
    }

    try {
        const account = await Account.findOne({
            where: { id: account_id, user_id },
        });

        if (!account) {
            return res.status(403).json({ msg: `Unauthorized: Account with id ${account_id} does not belong to you` });
        }

        const transaction = await Transaction.create({ amount, account_id, category_id, date, comment });
        res.json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ups, there was an error when trying to create the transaction' });
    }
};

export const updateTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { amount, account_id, category_id, date, comment } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
        return res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
    }

    if (!amount && !account_id && !category_id && !date) {
        return res.status(400).json({ msg: 'At least one field is required to update' });
    }

    if (amount && amount <= 0) {
        return res.status(400).json({ msg: 'Amount must be greater than 0' });
    }

    try {
        const transaction = await Transaction.findByPk(id);

        if (!transaction) {
            return res.status(404).json({ msg: `Transaction with id ${id} not found` });
        }

        if (account_id) {
            const account = await Account.findOne({ 
                where: { id: account_id, user_id },
            });

            if (!account) {
                return res.status(403).json({ msg: `Unauthorized: Account with id ${account_id} does not belong to you` });
            }
        }

        await transaction.update({ amount, account_id, category_id, date, comment });

        res.json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ups, there was an error when trying to update the transaction' });
    }
};

export const deleteTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user_id = req.user?.id;

    if (!user_id) {
        return res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
    }

    try {
        const transaction = await Transaction.findByPk(id);

        if (!transaction) {
            return res.status(404).json({ msg: `Transaction with id ${id} not found` });
        }

        await transaction.destroy();
        res.json({ msg: 'Transaction deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ups, there was an error when trying to delete the transaction' });
    }
};