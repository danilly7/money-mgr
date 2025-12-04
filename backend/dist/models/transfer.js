"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = require("../db/connection");
class Transfer extends sequelize_1.Model {
}
Transfer.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_transfer',
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0.01, //no valores negativos o cero
        },
    },
    origin_account_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    destination_account_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    comment: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    sequelize: connection_1.sequelize,
    modelName: 'Transfer',
    tableName: 'transfers',
    timestamps: false,
});
exports.default = Transfer;
