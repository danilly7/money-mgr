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
exports.deleteTransfer = exports.updateTransfer = exports.postTransfer = exports.getTransferById = exports.getAllTransfers = void 0;
const models_1 = __importDefault(require("../models"));
const sequelize_1 = require("sequelize");
const { Transfer, Account } = models_1.default;
const getAllTransfers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!user_id) {
        res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
        return;
    }
    let { page = 1, limit = 10 } = req.query; //ojo aquí hay paginación
    page = Math.max(Number(page), 1);
    limit = Math.max(Number(limit), 1);
    const offset = (page - 1) * limit;
    try {
        const result = yield Transfer.findAndCountAll({
            where: {
                [sequelize_1.Op.or]: [
                    { origin_account_id: { [sequelize_1.Op.in]: sequelize_1.Sequelize.literal(`(SELECT id FROM Accounts WHERE user_id = ${user_id})`) } },
                    { destination_account_id: { [sequelize_1.Op.in]: sequelize_1.Sequelize.literal(`(SELECT id FROM Accounts WHERE user_id = ${user_id})`) } }
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ups, there was an error when trying to get the transfers',
        });
    }
});
exports.getAllTransfers = getAllTransfers;
const getTransferById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!user_id) {
        res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
        return;
    }
    if (isNaN(Number(id))) {
        res.status(400).json({ msg: 'Invalid transfer ID' });
        return;
    }
    try {
        const transfer = yield Transfer.findOne({
            where: {
                id,
                [sequelize_1.Op.or]: [
                    { origin_account_id: { [sequelize_1.Op.in]: sequelize_1.Sequelize.literal(`(SELECT id FROM Accounts WHERE user_id = ${user_id})`) } },
                    { destination_account_id: { [sequelize_1.Op.in]: sequelize_1.Sequelize.literal(`(SELECT id FROM Accounts WHERE user_id = ${user_id})`) } }
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
        }
        else {
            res.status(404).json({
                msg: `Transfer with id ${id} does NOT exist`,
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ups, there was an error when trying to get the transfer',
        });
    }
});
exports.getTransferById = getTransferById;
const postTransfer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { amount, origin_account_id, destination_account_id, date, comment } = req.body;
    const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
        const originAccount = yield models_1.default.Account.findByPk(origin_account_id);
        const destinationAccount = yield models_1.default.Account.findByPk(destination_account_id);
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
        const transfer = yield Transfer.create({ amount, origin_account_id, destination_account_id, date, comment });
        originAccount.balance -= amount;
        destinationAccount.balance += amount;
        yield originAccount.save();
        yield destinationAccount.save();
        res.json(transfer);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ups, there was an error when trying to create the transfer',
        });
    }
});
exports.postTransfer = postTransfer;
const updateTransfer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { amount, origin_account_id, destination_account_id, date, comment } = req.body;
    const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
        const transfer = yield Transfer.findByPk(id);
        if (!transfer) {
            res.status(404).json({ msg: `Transfer with id ${id} does NOT exist` });
            return;
        }
        const originAccount = yield Account.findByPk(origin_account_id || transfer.origin_account_id);
        const destinationAccount = yield Account.findByPk(destination_account_id || transfer.destination_account_id);
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
        yield originAccount.save();
        yield destinationAccount.save();
        yield transfer.update({ amount, origin_account_id, destination_account_id, date, comment });
        res.json(transfer);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ups, there was an error when trying to update the transfer',
        });
    }
});
exports.updateTransfer = updateTransfer;
const deleteTransfer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!user_id) {
        res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
        return;
    }
    try {
        const transfer = yield Transfer.findByPk(id);
        if (!transfer) {
            res.status(404).json({ msg: `Transfer with id ${id} does NOT exist` });
            return;
        }
        const originAccount = yield models_1.default.Account.findByPk(transfer.origin_account_id);
        const destinationAccount = yield models_1.default.Account.findByPk(transfer.destination_account_id);
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
        yield originAccount.save();
        yield destinationAccount.save();
        yield transfer.destroy();
        res.json({ msg: `Transfer with id ${id} was deleted` });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ups, there was an error when trying to delete the transfer',
        });
    }
});
exports.deleteTransfer = deleteTransfer;
