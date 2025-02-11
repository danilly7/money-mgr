"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const DailyRev = connection_1.default.define('daily_revenue', {
    id_dailyrev: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    closed: {
        type: sequelize_1.DataTypes.TINYINT,
        allowNull: false,
    },
    weekday_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    bank_holiday: {
        type: sequelize_1.DataTypes.TINYINT,
        allowNull: false,
    },
    total_sales: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    total_clients: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'daily_revenue',
    timestamps: false, //esto es para createdAt y updatedAt!
});
exports.default = DailyRev;
