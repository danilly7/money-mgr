import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../db/connection';

class Transfer extends Model<InferAttributes<Transfer>, InferCreationAttributes<Transfer>> {
    public id!: CreationOptional<number>;
    public amount!: number;
    public origin_account_id!: number;
    public destination_account_id!: number;
    public date!: Date;
    public comment?: string;
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