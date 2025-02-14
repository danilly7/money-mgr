import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../db/connection';

interface UserAttributes {
    id: number;
    uid: string;
    name: string;
    email: string;
}

class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public uid!: string;
    public name!: string;
    public email!: string;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_user',
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
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: false,
    }
);

export default User;

//aquí no ponemos account_id, pq puede tener varias cuentas.
//en cambio en accounts sí que veremos user_id, pq la relación es más directa.