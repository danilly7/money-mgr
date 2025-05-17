import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

//Carga variables de entorno, el .env
dotenv.config();

function getEnvVar(...names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name];
    if (value) return value;
  }
  return undefined;
}

//Configuración de Sequelize para manejar la conexión a la bbdd de manera FLEXIBLE
const sequelize = new Sequelize(
  getEnvVar('DB_NAME', 'MYSQLDATABASE') || 'default_db',
  getEnvVar('DB_USER', 'MYSQLUSER') || 'default_user',
  getEnvVar('DB_PASS', 'MYSQLPASSWORD') || '',
  {
    host: getEnvVar('DB_HOST', 'MYSQLHOST') || 'localhost',
    port: Number(getEnvVar('DB_PORT', 'MYSQLPORT') || '3306'),
    dialect: (process.env.DB_DIALECT as any) || 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false, //solo habilitar logging en desarrollo
    timezone: '+01:00', //hora Barcelona, esto es para las fechas de transactions y transfers. Evitamos problemas a medianoche
  }
);

//Sincronización de los modelos de Sequelize con la bbdd
const syncroModel = async () => {
  try {
    console.log('Syncing models with the database...');
    await sequelize.sync({ force: false });
    /* OJO IMPORTANTE:
      - "alter: true": Modifica las tablas existentes sin borrar datos.  
      - "force: true": Borra todas las tablas y las vuelve a crear.
    */

    console.log('Models synchronized successfully.');
  } catch (error) {
    console.error('Unable to sync models:', error);
  }
};

//Comprueba la conexión a la bbdd
const testConnection = async () => {
  try {
    console.log('Attempting to authenticate with the database...');

    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    //si la conexión es correcta, sincroniza los modelos
    await syncroModel();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { sequelize, testConnection, syncroModel };