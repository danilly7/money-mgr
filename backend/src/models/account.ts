import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../db/connection';

class Account extends Model<InferAttributes<Account>, InferCreationAttributes<Account>> {
    public id!: CreationOptional<number>;
    public name!: string;
    public balance!: number;
    public visibility!: boolean;
    public user_id!: number;
}

Account.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_account',
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        visibility: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true, //por defecto true, se puede tocar, pero porsiaca es true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Account',
        tableName: 'accounts',
        timestamps: false,
    }
);

export default Account;
//transfer y transaction tienen un account_id
//pero un usuario puede tener varias cuentas, es más importante y más directa su relación con el account