import { DataTypes } from 'sequelize';
import { sequelize } from '../db/connection';

const Competitor = sequelize.define('competitor', {
    id_competitor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true, 
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    distance: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    offers: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    price: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    hours: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    color: {
        type: DataTypes.STRING(7),
        allowNull: true,
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
    },
}, {
    tableName: 'competitors',
    timestamps: false,
});

export default Competitor;