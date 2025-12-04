"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncroModel = exports.testConnection = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
//Carga variables de entorno, el .env
dotenv_1.default.config();
function getEnvVar(...names) {
    for (const name of names) {
        const value = process.env[name];
        if (value)
            return value;
    }
    return undefined;
}
//Configuración de Sequelize para manejar la conexión a la bbdd de manera FLEXIBLE
const sequelize = new sequelize_1.Sequelize(getEnvVar('DB_NAME', 'MYSQLDATABASE') || 'default_db', getEnvVar('DB_USER', 'MYSQLUSER') || 'default_user', getEnvVar('DB_PASS', 'MYSQLPASSWORD') || '', {
    host: getEnvVar('DB_HOST', 'MYSQLHOST') || 'localhost',
    port: Number(getEnvVar('DB_PORT', 'MYSQLPORT') || '3306'),
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false, //solo habilitar logging en desarrollo
    timezone: '+01:00', //hora Barcelona, esto es para las fechas de transactions y transfers. Evitamos problemas a medianoche
});
exports.sequelize = sequelize;
//Sincronización de los modelos de Sequelize con la bbdd
const syncroModel = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Syncing models with the database...');
        yield sequelize.sync({ force: false });
        /* OJO IMPORTANTE:
          - "alter: true": Modifica las tablas existentes sin borrar datos.
          - "force: true": Borra todas las tablas y las vuelve a crear.
        */
        console.log('Models synchronized successfully.');
    }
    catch (error) {
        console.error('Unable to sync models:', error);
    }
});
exports.syncroModel = syncroModel;
//Comprueba la conexión a la bbdd
const testConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Attempting to authenticate with the database...');
        yield sequelize.authenticate();
        console.log('Connection has been established successfully.');
        //si la conexión es correcta, sincroniza los modelos
        yield syncroModel();
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
exports.testConnection = testConnection;
