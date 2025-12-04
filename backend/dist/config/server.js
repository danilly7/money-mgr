"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const admin = __importStar(require("firebase-admin"));
const start_data_1 = require("../utils/start_data");
const connection_1 = require("../db/connection");
const account_routes_1 = __importDefault(require("../routes/account-routes"));
const categories_routes_1 = __importDefault(require("../routes/categories-routes"));
const transactions_routes_1 = __importDefault(require("../routes/transactions-routes"));
const transfers_routes_1 = __importDefault(require("../routes/transfers-routes"));
const users_routes_1 = __importDefault(require("../routes/users-routes"));
const category_1 = __importDefault(require("../models/category"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3000';
        this.initializeFirebase();
        this.middlewares(); //configuramos middlewares
        this.routes(); //definimos las rutas
        this.start(); //conectamos con la bbdd y cargamos los datos iniciales
        this.listen(); //escuchamos al servidor
    }
    initializeFirebase() {
        // Asegúrate de que este código esté antes de cualquier middleware
        try {
            if (!admin.apps.length) {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: process.env.FIREBASE_PROJECT_ID, //la ! dice que tengo que tener esto sí o sí
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                    }),
                    // esto es si lo pillo de la carpeta → credential: admin.credential.cert(require("./credentials/firebaseServiceAccountKey.json"))
                });
            }
            else {
                admin.app(); // Si ya está inicializado, usa la instancia existente
            }
        }
        catch (error) {
            console.error('Error initializing Firebase:', error);
        }
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Application running on port ${this.port}`);
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, connection_1.testConnection)(); //nos conectamos a la base de datos y sincronizamos modelos
                const categories = yield category_1.default.count(); //se hace comprovación si ya existen
                if (categories === 0) {
                    yield (0, start_data_1.insertInitialData)(); //insertar solo si no hay datos
                }
                console.log('Server started successfully.');
            }
            catch (error) {
                console.error('Error during startup:', error);
            }
        });
    }
    routes() {
        this.app.get('/', (req, res) => {
            res.json({
                msg: 'API working'
            });
        });
        this.app.use('/api/users', users_routes_1.default);
        this.app.use('/api/accounts', account_routes_1.default);
        this.app.use('/api/categories', categories_routes_1.default);
        this.app.use('/api/transactions', transactions_routes_1.default);
        this.app.use('/api/transfers', transfers_routes_1.default);
    }
    middlewares() {
        this.app.use((0, cors_1.default)()); //Habilita CORS sin restricciones
        //OJO Para restringir CORS, descomentar esto:
        /*
        this.app.use(cors({
            origin: 'https://blalbblablalb.com',
            methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos, aquí están puestos todos
            allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
        }));
        */
        this.app.use(express_1.default.json()); //Habilita JSON en las solicitudes
    }
}
exports.Server = Server;
;
