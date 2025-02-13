import { DataTypes } from 'sequelize';
import { sequelize } from '../db/connection';

const Category = sequelize.define('category', {
    id_category: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        },
    },
    type: {
        type: DataTypes.ENUM("income", "expense"), //aquí ya divido
        allowNull: false,
    },
}, {
    tableName: 'categories',
    timestamps: false, //en aquí no me interesa tanto saber el createdAt y updatedAt
});

export default Category;