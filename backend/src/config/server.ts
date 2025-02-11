import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import revenueRouter from '../routes/revenue';
import calendarRouter from '../routes/calendar';
import competitorRouter from '../routes/competitors';
import { insertInitialData } from '../utils/start_data';
import {testConnection } from '../db/connection';

export class Server {
    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3001';
        this.middlewares();  //configuramos middlewares
        this.routes();       //definimos las rutas
        this.start();        //conectamos con la bbdd y cargamos los datos iniciales
        this.listen();       //escuchamos al servidor
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Application running on port ${this.port}`)
        });
    }

    async start() {
        try {
            await testConnection();  //Nos conectamos a la base de datos y sincronizamos modelos
            await insertInitialData(); //Datos iniciales (si es necesario)
            console.log('Server started successfully.');
        } catch (error) {
            console.error('Error during startup:', error);
        }
    }

    routes() {
        this.app.get('/', (req: Request, res: Response) => {
            res.json({
                msg: 'API working'
            })
        });
        this.app.use('/api/revenue', revenueRouter);
        this.app.use('/api/events', calendarRouter);
        this.app.use('/api/competitors', competitorRouter);
    }

    middlewares() {
        this.app.use(cors()); //Habilita CORS sin restricciones

        //OJO Para restringir CORS, descomentar esto:
        /*
        this.app.use(cors({
            origin: 'https://blalbblablalb.com',
            methods: ['GET', 'POST', 'PUT'], // Métodos permitidos
            allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
        }));
        */

        this.app.use(express.json()); //Habilita JSON en las solicitudes
    }
};