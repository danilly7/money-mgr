import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

//Carga variables de entorno, el .env
dotenv.config();

//Configuración de Sequelize para manejar la conexión a la bbdd
const sequelize = new Sequelize(
  process.env.DB_NAME || 'default_db',
  process.env.DB_USER || 'default_user',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: (process.env.DB_DIALECT as any) || 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false, //solo habilitar logging en desarrollo
    timezone: '+01:00', //hora Barcelona, esto es para las fechas de transactions y transfers. Evitamos problemas a medianoche
  }
);

//Sincronización de los modelos de Sequelize con la bbdd
const syncroModel = async () => {
  try {
    await sequelize.sync({ alter: true }); 
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
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    //si la conexión es correcta, sincroniza los modelos
    await syncroModel();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { sequelize, testConnection, syncroModel };