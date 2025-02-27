import { Server } from "./config/server";
import dotenv from 'dotenv';

//Configuramos las variables de ambiente:
dotenv.config();

const server = new Server();