import { DataTypes } from 'sequelize';
import { sequelize } from '../db/connection';

const User = sequelize.define('user', {
    id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    uid: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    account_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'users',
    timestamps: false,
});

export default User;