import { Request, Response } from 'express';
import models from '../models';
import { sequelize } from '../db/connection';

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
        //de tooooooodas las cuentas del usuario
        const userAccounts = await Account.findAll({
            attributes: ['id'],
            where: { user_id },
            raw: true,
        });

        if (userAccounts.length === 0) {
            res.status(404).json({ msg: 'No accounts found for this user' });
            return;
        }

        const accountIds = userAccounts.map((account: { id: number }) => account.id);

        const result = await Transaction.findAndCountAll({
            limit,
            offset,
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id_category', 'name', 'type'],
                },
                {
                    model: Account,
                    as: 'account',
                    attributes: ['id', 'name', 'balance'],
                },
            ],
            where: {
                account_id: accountIds,
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
        const userAccounts = await Account.findAll({
            attributes: ['id'],
            where: { user_id },
            raw: true,
        });

        if (userAccounts.length === 0) {
            res.status(404).json({ msg: 'No accounts found for this user' });
            return;
        }

        const accountIds = userAccounts.map((account: { id: number }) => account.id);

        const transaction = await Transaction.findOne({
            where: {
                id,
                account_id: accountIds,
            },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id_category', 'name', 'type'],
                },
                {
                    model: Account,
                    as: 'account',
                    attributes: ['id', 'name', 'balance'],
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
        res.status(500).json({ msg: 'Ups, there was an error when trying to get the transaction' });
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

    if (typeof amount !== 'number' || amount <= 0) {
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

        const category = await Category.findByPk(category_id);
        if (!category) {
            res.status(400).json({ msg: 'Category not found' });
            return;
        }

        if (category.type === 'expense' && amount > account.balance) {
            res.status(400).json({ msg: 'Amount cannot be higher than the money available in the account' });
            return;
        }

        const transaction = await Transaction.create({ amount, account_id, category_id, date, comment });

        const currentBalance = parseFloat(account.balance.toString());
        let updatedBalance = currentBalance;

        if (category.type === 'income') {
            updatedBalance = parseFloat((currentBalance + amount).toFixed(2));
        } else if (category.type === 'expense') {
            updatedBalance = parseFloat((currentBalance - amount).toFixed(2));
        }

        await account.update({ balance: updatedBalance });

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

    if (amount && (typeof amount !== 'number' || amount <= 0)) {
        res.status(400).json({ msg: 'Amount must be greater than 0' });
        return;
    }

    try {
        const transaction = await Transaction.findByPk(id);

        if (!transaction) {
            res.status(404).json({ msg: `Transaction with id ${id} not found` });
            return;
        }

        const oldCategory = await Category.findByPk(transaction.category_id);
        const oldAmount = transaction.amount;

        let account: InstanceType<typeof Account> | null = null;

        if (account_id) {
            account = await Account.findOne({
                where: { id: account_id, user_id },
            });

            if (!account) {
                res.status(403).json({ msg: `Unauthorized: Account with id ${account_id} does not belong to you` });
                return;
            }
        } else {
            account = await Account.findOne({
                where: { id: transaction.account_id, user_id },
            });

            if (!account) {
                res.status(403).json({ msg: `Unauthorized: Account with id ${transaction.account_id} does not belong to you` });
                return;
            }
        }

        if (amount > account.balance) {
            res.status(400).json({ msg: 'Amount cannot be higher than the money available in the account' });
            return;
        }

        await transaction.update({ amount, account_id, category_id, date, comment });

        const newCategory = category_id ? await Category.findByPk(category_id) : oldCategory;
        const newAmount = amount || oldAmount;

        let updatedBalance = parseFloat(account.balance.toString());

        if (oldCategory?.type === 'income') {
            updatedBalance = parseFloat((updatedBalance - oldAmount).toFixed(2));
        } else if (oldCategory?.type === 'expense') {
            updatedBalance = parseFloat((updatedBalance + oldAmount).toFixed(2));
        }

        if (newCategory?.type === 'income') {
            updatedBalance = parseFloat((updatedBalance + newAmount).toFixed(2));
        } else if (newCategory?.type === 'expense') {
            updatedBalance = parseFloat((updatedBalance - newAmount).toFixed(2));
        }

        await account.update({ balance: updatedBalance });

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

    const t = await sequelize.transaction();

    try {
        const transaction = await Transaction.findByPk(id, { transaction: t });

        if (!transaction) {
            await t.rollback();
            res.status(404).json({ msg: `Transaction with id ${id} not found` });
            return;
        }

        const { account_id } = transaction;

        const account = await Account.findOne({
            where: { id: account_id, user_id },
            transaction: t,
        });

        if (!account) {
            await t.rollback();
            res.status(403).json({ msg: `Unauthorized: Account with id ${account_id} does not belong to you` });
            return;
        }

        const category = await Category.findByPk(transaction.category_id, { transaction: t });

        let updatedBalance = parseFloat(account.balance.toString());
        const transactionAmount = parseFloat(transaction.amount.toString());

        if (category?.type === 'income') {
            updatedBalance = parseFloat((updatedBalance - transactionAmount).toFixed(2)); 
        } else if (category?.type === 'expense') {
            updatedBalance = parseFloat((updatedBalance + transactionAmount).toFixed(2)); 
        }

        await account.update({ balance: updatedBalance }, { transaction: t });
        await transaction.destroy({ transaction: t });

        await t.commit(); 

        res.json({ msg: 'Transaction deleted successfully' });
    } catch (error) {
        await t.rollback(); 
        console.error(error);
        res.status(500).json({ msg: 'Ups, there was an error when trying to delete the transaction' });
    }
};