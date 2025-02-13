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
        validate: {
            isEmail: true,
        },
    },
}, {
    tableName: 'users',
    timestamps: false,
});

export default User;

//aquí no ponemos account_id, pq puede tener varias cuentas.
//en cambio en accounts sí que veremos user_id, pq la relación es más directa.