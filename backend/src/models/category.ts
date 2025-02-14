import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../db/connection';

type CategoryType = 'income' | 'expense';

interface CategoryAttributes {
    id: number;
    name: string;
    type: CategoryType;
}

class Category extends Model<CategoryAttributes> implements CategoryAttributes {
    public id!: number;
    public name!: string;
    public type!: CategoryType;
}

Category.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_category',
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
    },
    {
        sequelize,
        modelName: 'Category',
        tableName: 'categories',
        timestamps: false, //en aquí no me interesa tanto saber el createdAt y updatedAt
    }
);

export default Category;

