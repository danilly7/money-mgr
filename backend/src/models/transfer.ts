import { DataTypes } from 'sequelize';
import { sequelize } from '../db/connection';

const Transfer = sequelize.define('transfer', {
    id_transfer: {
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
    origin_account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    destination_account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn('CURDATE'),
    },
    comment: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    tableName: 'transfers',
    timestamps: true,
});

export default Transfer;