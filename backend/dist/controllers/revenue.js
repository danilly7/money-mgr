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
exports.updateDailyRevenue = exports.postDailyRevenue = exports.deleteDailyRevenue = exports.getDailyRevenue = exports.getRevenue = void 0;
const daily_revenue_1 = __importDefault(require("../models/daily_revenue"));
const getRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10 } = req.query;
    try {
        const result = yield daily_revenue_1.default.findAndCountAll({
            limit: Number(limit),
            offset: (Number(page) - 1) * Number(limit),
        });
        res.json({
            total: result.count,
            pages: Math.ceil(result.count / Number(limit)),
            currentPage: Number(page),
            data: result.rows,
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'Ups, there was an error when trying to get all the Daily Revenues',
        });
    }
});
exports.getRevenue = getRevenue;
const getDailyRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const dailyRev = yield daily_revenue_1.default.findByPk(id);
        if (dailyRev) {
            res.json(dailyRev);
        }
        else {
            res.status(404).json({
                msg: `Daily revenue with id ${id} does NOT exist (yet)`
            });
        }
    }
    catch (error) {
        res.status(500).json({
            msg: 'Ups, there was an error when trying to get the Daily Revenue',
        });
    }
});
exports.getDailyRevenue = getDailyRevenue;
const deleteDailyRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const dailyRev = yield daily_revenue_1.default.findByPk(id);
        if (!dailyRev) {
            res.status(404).json({
                msg: `Daily revenue with id ${id} does NOT exist`
            });
        }
        else {
            yield dailyRev.destroy();
            res.json({
                msg: `Daily revenue has been deleted succesfully`
            });
        }
    }
    catch (error) {
        res.status(500).json({
            msg: 'Ups, there was an error when trying to delete the Daily Revenue',
        });
    }
});
exports.deleteDailyRevenue = deleteDailyRevenue;
const postDailyRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, date, closed, bank_holiday, total_sales, total_clients } = req.body;
    try {
        const newRevenue = yield daily_revenue_1.default.create({
            title,
            date,
            closed,
            bank_holiday,
            total_sales,
            total_clients,
            weekday_id: new Date(date).getDay(),
        });
        res.json({
            msg: 'Daily Revenue has been added successfully',
            data: newRevenue,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error adding daily revenue:', error.message);
            res.status(500).json({
                msg: 'An error occurred while adding daily revenue',
                error: error.message,
            });
        }
        else {
            console.error('Unknown error:', error);
            res.status(500).json({
                msg: 'An unknown error occurred',
            });
        }
    }
});
exports.postDailyRevenue = postDailyRevenue;
const updateDailyRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const { id } = req.params;
    try {
        const dailyRev = yield daily_revenue_1.default.findByPk(id);
        if (dailyRev) {
            yield dailyRev.update(body);
            res.json({
                msg: 'Daily revenue has been updated successfully',
                body
            });
        }
        else {
            res.status(404).json({
                msg: `Daily revenue with id ${id} does NOT exist (yet)`
            });
        }
    }
    catch (error) {
        console.log(error);
        res.json({
            msg: `Ups, try again. An error has occured.`
        });
    }
});
exports.updateDailyRevenue = updateDailyRevenue;
