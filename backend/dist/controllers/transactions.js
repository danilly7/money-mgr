"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = exports.updateTransaction = exports.postTransaction = exports.getTransactionById = exports.getAllTransactions = void 0;
const models_1 = __importDefault(require("../models"));
const connection_1 = require("../db/connection");
const adjustBalance_1 = require("../utils/adjustBalance");
const { Transaction, Category, Account } = models_1.default;
const getAllTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
        const userAccounts = yield Account.findAll({
            attributes: ['id'],
            where: { user_id },
            raw: true,
        });
        if (userAccounts.length === 0) {
            res.status(404).json({ msg: 'No accounts found for this user' });
            return;
        }
        const accountIds = userAccounts.map((account) => account.id);
        const result = yield Transaction.findAndCountAll({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ups, there was an error when trying to get the transactions' });
    }
});
exports.getAllTransactions = getAllTransactions;
const getTransactionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!user_id) {
        res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
        return;
    }
    if (isNaN(Number(id))) {
        res.status(400).json({ msg: 'Invalid transaction ID' });
        return;
    }
    try {
        const userAccounts = yield Account.findAll({
            attributes: ['id'],
            where: { user_id },
            raw: true,
        });
        if (userAccounts.length === 0) {
            res.status(404).json({ msg: 'No accounts found for this user' });
            return;
        }
        const accountIds = userAccounts.map((account) => account.id);
        const transaction = yield Transaction.findOne({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ups, there was an error when trying to get the transaction' });
    }
});
exports.getTransactionById = getTransactionById;
const postTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { amount, account_id, category_id, date, comment } = req.body;
    const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
        const account = yield Account.findOne({
            where: { id: account_id, user_id },
        });
        if (!account) {
            res.status(403).json({ msg: `Unauthorized: Account with id ${account_id} does not belong to you` });
            return;
        }
        const category = yield Category.findByPk(category_id);
        if (!category) {
            res.status(400).json({ msg: 'Category not found' });
            return;
        }
        if (category.type === 'expense' && amount > account.balance) {
            res.status(400).json({ msg: 'Amount cannot be higher than the money available in the account' });
            return;
        }
        const transaction = yield Transaction.create({ amount, account_id, category_id, date, comment });
        const currentBalance = parseFloat(account.balance.toString());
        let updatedBalance = currentBalance;
        if (category.type === 'income') {
            updatedBalance = parseFloat((currentBalance + amount).toFixed(2));
        }
        else if (category.type === 'expense') {
            updatedBalance = parseFloat((currentBalance - amount).toFixed(2));
        }
        yield account.update({ balance: updatedBalance });
        res.json(transaction);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ups, there was an error when trying to create the transaction' });
    }
});
exports.postTransaction = postTransaction;
const updateTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { amount, account_id, category_id, date, comment } = req.body;
    const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!user_id) {
        res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
        return;
    }
    const hasValidUpdate = [amount, account_id, category_id, date, comment].some(field => field !== undefined && field !== null);
    if (!hasValidUpdate) {
        res.status(400).json({ msg: 'At least one valid field is required to update' });
        return;
    }
    if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
        res.status(400).json({ msg: 'Amount must be greater than 0' });
        return;
    }
    const t = yield connection_1.sequelize.transaction();
    try {
        const transaction = yield Transaction.findByPk(id, { transaction: t });
        if (!transaction) {
            yield t.rollback();
            res.status(404).json({ msg: `Transaction with id ${id} not found` });
            return;
        }
        const oldAccountId = transaction.account_id;
        const oldAmount = parseFloat(transaction.amount.toString());
        const oldCategory = yield Category.findByPk(transaction.category_id, { transaction: t });
        const newAccountId = account_id !== null && account_id !== void 0 ? account_id : transaction.account_id;
        const newAmount = amount !== undefined ? parseFloat(amount.toString()) : oldAmount;
        const newCategoryId = category_id !== null && category_id !== void 0 ? category_id : transaction.category_id;
        const newCategory = yield Category.findByPk(newCategoryId, { transaction: t });
        const oldAccount = yield Account.findOne({
            where: { id: oldAccountId, user_id },
            transaction: t,
        });
        const newAccount = oldAccountId === newAccountId
            ? oldAccount
            : yield Account.findOne({
                where: { id: newAccountId, user_id },
                transaction: t,
            });
        if (!oldAccount || !newAccount) {
            yield t.rollback();
            res.status(403).json({ msg: 'One or both accounts do not belong to the user' });
            return;
        }
        if ((newCategory === null || newCategory === void 0 ? void 0 : newCategory.type) === 'expense' && newAmount > newAccount.balance) {
            yield t.rollback();
            res.status(400).json({
                msg: 'Amount cannot be higher than the money available in the account',
            });
            return;
        }
        // Revertir saldo de la cuenta antigua
        if (oldCategory) {
            let oldBalance = parseFloat(oldAccount.balance.toString());
            oldBalance = (0, adjustBalance_1.adjustBalance)(oldBalance, oldAmount, oldCategory.type, 'subtract');
            oldBalance = Math.round(oldBalance * 100) / 100;
            yield oldAccount.update({ balance: oldBalance }, { transaction: t });
        }
        // Aplicar saldo a la cuenta nueva
        if (newCategory) {
            let newBalance = parseFloat(newAccount.balance.toString());
            newBalance = (0, adjustBalance_1.adjustBalance)(newBalance, newAmount, newCategory.type, 'add');
            newBalance = Math.round(newBalance * 100) / 100;
            yield newAccount.update({ balance: newBalance }, { transaction: t });
        }
        // Actualizar transacción
        const updateData = {};
        if (amount !== undefined)
            updateData.amount = newAmount;
        if (account_id !== undefined)
            updateData.account_id = account_id;
        if (category_id !== undefined)
            updateData.category_id = category_id;
        if (date !== undefined)
            updateData.date = date;
        if (comment !== undefined)
            updateData.comment = comment;
        yield transaction.update(updateData, { transaction: t });
        yield t.commit();
        res.json(transaction);
    }
    catch (error) {
        yield t.rollback();
        console.error('Update transaction error:', error);
        res.status(500).json({
            msg: 'Ups, there was an error when trying to update the transaction',
        });
    }
});
exports.updateTransaction = updateTransaction;
const deleteTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!user_id) {
        res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
        return;
    }
    const t = yield connection_1.sequelize.transaction();
    try {
        const transaction = yield Transaction.findByPk(id, { transaction: t });
        if (!transaction) {
            yield t.rollback();
            res.status(404).json({ msg: `Transaction with id ${id} not found` });
            return;
        }
        const { account_id } = transaction;
        const account = yield Account.findOne({
            where: { id: account_id, user_id },
            transaction: t,
        });
        if (!account) {
            yield t.rollback();
            res.status(403).json({ msg: `Unauthorized: Account with id ${account_id} does not belong to you` });
            return;
        }
        const category = yield Category.findByPk(transaction.category_id, { transaction: t });
        let updatedBalance = parseFloat(account.balance.toString());
        const transactionAmount = parseFloat(transaction.amount.toString());
        if ((category === null || category === void 0 ? void 0 : category.type) === 'income') {
            updatedBalance = parseFloat((updatedBalance - transactionAmount).toFixed(2));
        }
        else if ((category === null || category === void 0 ? void 0 : category.type) === 'expense') {
            updatedBalance = parseFloat((updatedBalance + transactionAmount).toFixed(2));
        }
        yield account.update({ balance: updatedBalance }, { transaction: t });
        yield transaction.destroy({ transaction: t });
        yield t.commit();
        res.json({ msg: 'Transaction deleted successfully' });
    }
    catch (error) {
        yield t.rollback();
        console.error(error);
        res.status(500).json({ msg: 'Ups, there was an error when trying to delete the transaction' });
    }
});
exports.deleteTransaction = deleteTransaction;
