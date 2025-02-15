import { Request, Response } from 'express';
import models from '../models';

const { Transaction, Category, Account } = models;

export const getAllTransactions = async (req: Request, res: Response): Promise<void> => { 
    const user_id = req.user?.id;

    if (!user_id) {
        res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
        return;
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
            where: {
                account_id: await Account.findAll({
                    attributes: ['id_account'],
                    where: { user_id },
                    raw: true,
                }).then(accounts => accounts.map(acc => acc.id)),
            },
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

export const getTransactionById = async (req: Request, res: Response): Promise<void> => { 
    const { id } = req.params;
    const user_id = req.user?.id;

    if (!user_id) {
        res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
        return;
    }

    if (isNaN(Number(id))) {
        res.status(400).json({ msg: 'Invalid transaction ID' });
        return;
    }

    try {
        const transaction = await Transaction.findOne({
            where: { 
                id,
                account_id: await Account.findAll({
                    attributes: ['id_account'],
                    where: { user_id },
                    raw: true,
                }).then(accounts => accounts.map(acc => acc.id)), 
            },
            include: [
                {
                    model: Category,
                    attributes: ['id_category', 'name', 'type'],
                },
                {
                    model: Account,
                    attributes: ['id_account', 'name', 'balance'],
                },
            ],
        });

        if (!transaction) {
            res.status(404).json({ msg: `Transaction with id ${id} not found` });
            return;
        }

        res.json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ups, there was an error when trying to get the transfer' });
    }
};

export const postTransaction = async (req: Request, res: Response): Promise<void> => { 
    const { amount, account_id, category_id, date, comment } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
        res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
        return;
    }

    if (!amount || !account_id || !category_id || !date) {
        res.status(400).json({ msg: 'All fields except comment are required' });
        return;
    }

    if (amount <= 0) {
        res.status(400).json({ msg: 'Amount must be greater than 0' });
        return;
    }

    try {
        const account = await Account.findOne({
            where: { id: account_id, user_id },
        });

        if (!account) {
            res.status(403).json({ msg: `Unauthorized: Account with id ${account_id} does not belong to you` });
            return;
        }

        const transaction = await Transaction.create({ amount, account_id, category_id, date, comment });
        res.json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ups, there was an error when trying to create the transaction' });
    }
};

export const updateTransaction = async (req: Request, res: Response): Promise<void> => { 
    const { id } = req.params;
    const { amount, account_id, category_id, date, comment } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
        res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
        return;
    }

    if (!amount && !account_id && !category_id && !date) {
        res.status(400).json({ msg: 'At least one field is required to update' });
        return;
    }

    if (amount && amount <= 0) {
        res.status(400).json({ msg: 'Amount must be greater than 0' });
        return;
    }

    try {
        const transaction = await Transaction.findByPk(id);

        if (!transaction) {
            res.status(404).json({ msg: `Transaction with id ${id} not found` });
            return;
        }

        if (account_id) {
            const account = await Account.findOne({ 
                where: { id: account_id, user_id },
            });

            if (!account) {
                res.status(403).json({ msg: `Unauthorized: Account with id ${account_id} does not belong to you` });
                return;
            }
        }

        await transaction.update({ amount, account_id, category_id, date, comment });

        res.json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ups, there was an error when trying to update the transaction' });
    }
};

export const deleteTransaction = async (req: Request, res: Response): Promise<void> => { 
    const { id } = req.params;
    const user_id = req.user?.id;

    if (!user_id) {
        res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
        return;
    }

    try {
        const transaction = await Transaction.findByPk(id);

        if (!transaction) {
            res.status(404).json({ msg: `Transaction with id ${id} not found` });
            return;
        }

        const { account_id } = transaction;

        const account = await Account.findOne({
            where: { id: account_id, user_id },
        });

        if (!account) {
            res.status(403).json({ msg: `Unauthorized: Account with id ${account_id} does not belong to you` });
            return;
        }

        await transaction.destroy();
        res.json({ msg: 'Transaction deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ups, there was an error when trying to delete the transaction' });
    }
};