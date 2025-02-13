import { DataTypes } from 'sequelize';
import { sequelize } from '../db/connection';

const Account = sequelize.define('account', {
    id_account: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: true, //pq puede ser que no tenga transacciones (aún)
    },
    visibility:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true, //por defecto true, se puede tocar, pero porsiaca es true
    },
    transfer_id:{
        type: DataTypes.INTEGER,
        allowNull: true, //igual, puede que no tenga transferencias (aún)
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    tableName: 'accounts',
    timestamps: false,
});

export default Account;
