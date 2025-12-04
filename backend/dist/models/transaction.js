"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = require("../db/connection");
class Transaction extends sequelize_1.Model {
}
Transaction.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_transaction',
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0.01, //no valores negativos o cero
        },
    },
    account_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    category_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW, //compatibilidad con más bbdd
    },
    comment: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true, //optativo
    },
}, {
    sequelize: connection_1.sequelize,
    modelName: 'Transaction',
    tableName: 'transactions',
    timestamps: true, //agregará createdAt y updatedAt
});
exports.default = Transaction;
