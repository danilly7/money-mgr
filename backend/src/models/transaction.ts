import { DataTypes } from 'sequelize';
import { sequelize } from '../db/connection';

const Transaction = sequelize.define('transaction', {
    id_transaction: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0.01, //no valores negativos o cero
        },
    },
    account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    category_id: { //como la categoria ya está dividida después puedo filtrar por tipo expense o income
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, //compatibilidad con más bbdd
    },
    comment: {
        type: DataTypes.STRING(255),
        allowNull: true, //optativo
    },
}, {
    tableName: 'transactions',
    timestamps: true, //agregará createdAt y updatedAt
});

export default Transaction;