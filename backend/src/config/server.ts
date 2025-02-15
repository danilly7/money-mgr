import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { insertInitialData } from '../utils/start_data';
import { testConnection } from '../db/connection';
import accountsRouter from '../routes/account-routes';
import * as admin from 'firebase-admin';

export class Server {
    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3001';

        this.initializeFirebase();

        this.middlewares();  //configuramos middlewares
        this.routes();       //definimos las rutas
        this.start();        //conectamos con la bbdd y cargamos los datos iniciales
        this.listen();       //escuchamos al servidor
    }

    private initializeFirebase() {
        // Asegúrate de que este código esté antes de cualquier middleware
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
                // O usa tu clave de servicio si no es la predeterminada
                // credential: admin.credential.cert(require("./path/to/serviceAccountKey.json"))
            });
        } else {
            admin.app(); // Si ya está inicializado, usa la instancia existente
        }
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
        // Manejo de rutas con try-catch para capturar errores inesperados
        this.app.use('/api/accounts', async (req: Request, res: Response, next) => {
            try {
                await accountsRouter(req, res, next);
            } catch (error) {
                console.error('Error in accounts route:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
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