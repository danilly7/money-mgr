import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../db/connection';

type CategoryType = 'income' | 'expense';

interface CategoryAttributes { //este tiene un tipado más fuerte
    id: number;
    name: string;
    type: CategoryType;
    description?: string;
}

class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> implements CategoryAttributes {
    public id!:  CreationOptional<number>;;
    public name!: string;
    public type!: CategoryType;
    public description?: string;
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
                isAlphanumeric: true, 
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

