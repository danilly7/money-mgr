import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../db/connection';

class Transaction extends Model<InferAttributes<Transaction>, InferCreationAttributes<Transaction>> {
    public id!: CreationOptional<number>;
    public amount!: number;
    public account_id!: number;
    public category_id!: number;
    public date!: Date;
    public comment?: string;
}

Transaction.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_transaction',
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
    },
    {
        sequelize,
        modelName: 'Transaction',
        tableName: 'transactions',
        timestamps: true, //agregará createdAt y updatedAt
    }
);

export default Transaction;