"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = require("../db/connection");
class Category extends sequelize_1.Model {
    ;
}
Category.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_category',
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            isAlphanumeric: true,
        },
    },
    type: {
        type: sequelize_1.DataTypes.ENUM("income", "expense"), //aquí ya divido
        allowNull: false,
    },
}, {
    sequelize: connection_1.sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: false, //en aquí no me interesa tanto saber el createdAt y updatedAt
});
exports.default = Category;
