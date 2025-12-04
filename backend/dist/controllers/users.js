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
exports.updateUser = exports.postUser = exports.getUserById = exports.getAllUsers = void 0;
const models_1 = __importDefault(require("../models"));
const { User } = models_1.default;
//IMPORTANTE: gets y post están sin restringir
//solo update está restringido en este moment
//no tiene delete por el momento
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield User.findAndCountAll();
        res.json({ count: result.count, users: result.rows }); //tmb puede ser res.json({ data: result }) pero todo junta la info
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ups, there was an error when trying to get all the users',
        });
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        res.status(400).json({ msg: 'Invalid user ID' });
        return;
    }
    try {
        const user = yield User.findByPk(id);
        if (!user) {
            res.status(404).json({ msg: `User with id ${id} does NOT exist (yet)` });
            return;
        }
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ups, there was an error when trying to get the user',
        });
    }
});
exports.getUserById = getUserById;
const postUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Authorization Header:", req.headers.authorization);
    console.log('Request body:', req.body);
    const { name, email, uid } = req.body;
    if (!uid) {
        res.status(401).json({ msg: "User is not authenticated in Firebase" });
        return;
    }
    if (!name || !email) {
        res.status(400).json({ msg: "All fields are required" });
        return;
    }
    try {
        const existingUser = yield User.findOne({ where: { uid } });
        if (existingUser) {
            res.status(409).json({ msg: 'User already exists' });
            return;
        }
        console.log('Creating user with:', { name, email, uid });
        const user = yield User.create({ name, email, uid });
        console.log('User created successfully:', user);
        res.status(201).json(user);
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            msg: 'Ups, there was an error when trying to create the user',
        });
    }
});
exports.postUser = postUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { name, email } = req.body;
    const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; //el único que tiene auth pq solo el mismo user puede hacerlo.
    if (!user_id) {
        res.status(401).json({ msg: 'Unauthorized: No user authenticated' });
        return;
    }
    if (!name && !email) {
        res.status(400).json({ msg: 'At least one field is required to update' });
        return;
    }
    try {
        const user = yield User.findByPk(id);
        if (!user) {
            res.status(404).json({
                msg: `User with id ${id} not found`,
            });
            return;
        }
        if (user_id !== user.id) {
            res.status(403).json({ msg: 'Forbidden: You can only update your own account' });
            return;
        }
        yield user.update({ name, email });
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ups, there was an error when trying to update the user',
        });
    }
});
exports.updateUser = updateUser;
