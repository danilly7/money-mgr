"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = require("../db/connection");
class Account extends sequelize_1.Model {
}
Account.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_account',
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        // unique: true, → ya no unique pq muchos usuarios pueden llamar una cuenta igual
    },
    balance: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    visibility: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true, //por defecto true, se puede tocar, pero porsiaca es true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: connection_1.sequelize,
    modelName: 'Account',
    tableName: 'accounts',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['name', 'user_id'], //unicidad por nombre y usuario
        },
    ],
});
exports.default = Account;
//transfer y transaction tienen un account_id
//pero un usuario puede tener varias cuentas, es más importante y más directa su relación con el account
