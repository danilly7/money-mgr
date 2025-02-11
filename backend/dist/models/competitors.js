"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const Competitor = connection_1.default.define('competitor', {
    id_competitor: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    address: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    distance: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    offers: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    price: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
    },
    hours: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    color: {
        type: sequelize_1.DataTypes.STRING(7),
        allowNull: true,
    },
    latitude: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    longitude: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    tableName: 'competitors',
    timestamps: false,
});
exports.default = Competitor;
