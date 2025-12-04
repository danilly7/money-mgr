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
exports.deleteAccount = exports.updateAccount = exports.postAccount = exports.getAccountById = exports.getAllAccounts = void 0;
const models_1 = __importDefault(require("../models"));
const { Account, User } = models_1.default;
const getAllAccounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authenticatedUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!authenticatedUserId) {
        res.status(401).json({ message: "Unauthorized: No user authenticated" });
        return;
    }
    try {
        const result = yield Account.findAndCountAll({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ups, there was an error when trying to get the accounts" });
    }
});
exports.getAllAccounts = getAllAccounts;
const getAccountById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const authenticatedUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!authenticatedUserId) {
        res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
        return;
    }
    if (isNaN(Number(id))) {
        res.status(400).json({ msg: 'Invalid account ID' });
        return;
    }
    try {
        const account = yield Account.findOne({
            where: { id, user_id: authenticatedUserId },
            include: [{ model: User, as: "user" }],
        });
        if (!account) {
            res.status(404).json({ message: "Account not found" });
            return;
        }
        res.json(account);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ups, there was an error when trying to get the account" });
    }
});
exports.getAccountById = getAccountById;
const postAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, balance, visibility, user_id } = req.body;
    const authenticatedUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
        const newAccount = yield Account.create({ name, balance, visibility, user_id });
        res.status(201).json(newAccount);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ups, there was an error when trying to create the account" });
    }
});
exports.postAccount = postAccount;
const updateAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { name, balance, visibility } = req.body; //id_user no lo ponemos en el req body pq así no hay opción de update
    const authenticatedUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!authenticatedUserId) {
        res.status(401).json({ message: "Unauthorized: No user authenticated" });
        return;
    }
    if (!name && !balance && !visibility) {
        res.status(400).json({ msg: 'At least one field is required to update' });
        return;
    }
    try {
        const account = yield Account.findByPk(id, { include: [{ model: User, as: "user" }] });
        if (!account) {
            res.status(404).json({ message: `Account with id ${id} not found` });
            return;
        }
        if (account.user_id !== authenticatedUserId) {
            res.status(403).json({ message: "Forbidden: You can only update your own accounts" });
            return;
        }
        yield account.update({ name, balance, visibility }); //no user_id pq no quiero que se pueda update
        res.json(account);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ups, there was an error when trying to update the account" });
    }
});
exports.updateAccount = updateAccount;
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const authenticatedUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!authenticatedUserId) {
        res.status(401).json({ message: "Unauthorized: No user authenticated" });
        return;
    }
    try {
        const account = yield Account.findByPk(id, { include: [{ model: User, as: "user" }] });
        if (!account) {
            res.status(404).json({ message: `Account with id ${id} not found` });
            return;
        }
        if (account.user_id !== authenticatedUserId) {
            res.status(403).json({ message: "Forbidden: You can only delete your own accounts" });
            return;
        }
        yield account.destroy();
        res.json({ message: "Account deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ups, there was an error when trying to delete the account" });
    }
});
exports.deleteAccount = deleteAccount;
