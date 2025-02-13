import {Model, DataTypes } from 'sequelize';
import { sequelize } from '../db/connection';
import Account from './account';

interface TransferAttributes {
    id: number;
    amount: number;
    origin_account_id: number;
    destination_account_id: number;
    date: string;
    comment?: string;
}

class Transfer extends Model<TransferAttributes> implements TransferAttributes {
    public id!: number;
    public amount!: number;
    public origin_account_id!: number;
    public destination_account_id!: number;
    public date!: string;
    public comment?: string;

    public originAccount!: Account;  //relación c/cuenta de origen
    public destinationAccount!: Account; //relación c/cuenta de destino
}

Transfer.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_transfer',
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
            defaultValue: DataTypes.NOW,
        },
        comment: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Transfer',
        tableName: 'transfers',
        timestamps: false,
    }
);

export default Transfer;