import { DataTypes } from 'sequelize';
import { sequelize } from '../db/connection';

const DailyRev = sequelize.define('daily_revenue', {
    id_dailyrev: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: true,
        unique: true,
    },
    closed: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    weekday_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    bank_holiday: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    total_sales: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    total_clients: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'daily_revenue',
    timestamps: false, //esto es para createdAt y updatedAt!
});

export default DailyRev;