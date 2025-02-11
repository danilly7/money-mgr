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
const sequelize_1 = require("sequelize");
const competitors_1 = __importDefault(require("../models/competitors"));
const sequelize = new sequelize_1.Sequelize('revenue', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});
const initializeCompetitorsData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield competitors_1.default.count();
        if (count === 0) {
            console.log('No competitors found. Adding default competitors...');
            yield competitors_1.default.bulkCreate([
                {
                    "id_competitor": 1,
                    "name": "La Teca de l'Àvia",
                    "address": "C/Degà de Bahí, 5",
                    "distance": "-",
                    "offers": "Daily menu during weekdays, and rotisserie chicken on Thursdays and weekends. Homemade food.",
                    "price": "€",
                    "hours": "Open every day except Sundays and Monday afternoons.",
                    "color": "bg-yellow-100",
                    "latitude": 41.3964,
                    "longitude": 2.1845
                },
                {
                    "id_competitor": 2,
                    "name": "El Xamfrà d’en Xifré",
                    "address": "C/ Mallorca, 554",
                    "distance": "3 minutes",
                    "offers": "Rotisserie chicken, roasted potatoes, croquettes, and cannelloni.",
                    "price": "€",
                    "hours": "Open for lunch service on Thursdays, Fridays, and weekends. Closed on other days.",
                    "color": "bg-gray-100",
                    "latitude": 41.4040,
                    "longitude": 2.1796
                },
                {
                    "id_competitor": 3,
                    "name": "El Rey del Pollo",
                    "address": "C/ Degà de Bahí, 49",
                    "distance": "2 minutes",
                    "offers": "Daily menu during weekdays. They also make rotisserie chicken and sides.",
                    "price": "€",
                    "hours": "Open for lunch. Closed on Mondays.",
                    "color": "bg-gray-100",
                    "latitude": 41.3969,
                    "longitude": 2.1870
                },
                {
                    "id_competitor": 4,
                    "name": "La Cuina de la Carme",
                    "address": "C/ Muntanya, 47",
                    "distance": "3 minutes",
                    "offers": "Daily menu during weekdays and roast chicken. They also offer home delivery.",
                    "price": "€",
                    "hours": "Open until 5 PM. Closed on Tuesdays.",
                    "color": "bg-gray-100",
                    "latitude": 41.4082,
                    "longitude": 2.1705
                },
                {
                    "id_competitor": 5,
                    "name": "El Ruedo restaurant",
                    "address": "C/ Rosselló, 540",
                    "distance": "4 minutes",
                    "offers": "Peruvian restaurant, serves rotisserie chicken.",
                    "price": "€€",
                    "hours": "Primarily open for dinner service in the evenings. Closed on Tuesdays.",
                    "color": "bg-gray-100",
                    "latitude": 41.3961,
                    "longitude": 2.1599
                },
                {
                    "id_competitor": 6,
                    "name": "Set de Llegums",
                    "address": "C/ Rogent, 124",
                    "distance": "3 minutes",
                    "offers": "Primarily sells all types of legumes. Also offers croquettes, some ready-to-eat dishes, and bulk olives.",
                    "price": "€",
                    "hours": "Open Monday to Friday until 8:30 PM, and Saturdays until 2:30 PM. Closed on Sundays.",
                    "color": "bg-gray-100",
                    "latitude": 41.4275,
                    "longitude": 2.1790
                },
                {
                    "id_competitor": 7,
                    "name": "Xarcuteries Bosch",
                    "address": "C/ València, 558",
                    "distance": "2 minutes",
                    "offers": "Main activity is a delicatessen. Also offers ready-to-eat dishes and pre-seasoned dishes for cooking.",
                    "price": "€€",
                    "hours": "Open until late from Monday to Saturday. Closed on Sundays.",
                    "color": "bg-gray-100",
                    "latitude": 41.4069,
                    "longitude": 2.1793
                },
                {
                    "id_competitor": 8,
                    "name": "Casa Tobella",
                    "address": "C/ València, 555",
                    "distance": "7 minutes",
                    "offers": "Gourmet delicatessen. Also offers ready-to-eat dishes.",
                    "price": "€€",
                    "hours": "Open Monday to Friday. Fridays and Saturdays usually close a bit earlier, but open until 8:30 PM. Closed on Sundays.",
                    "color": "bg-gray-100",
                    "latitude": 41.4072,
                    "longitude": 2.1775
                },
            ]);
            console.log('Default competitors added successfully.');
        }
        else {
            console.log('Competitors already exist in the database.');
        }
    }
    catch (error) {
        console.error('Error initializing data:', error);
    }
});
const syncroModel = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //sincroniza el modelo con la base de datos (crea la tabla si no existe)
        //con "alter: true" se sincronizan las columnas y se crean/eliminan si fuera necesario
        yield sequelize.sync({ force: false }).then(() => {
            console.log('Modelos sincronizados con la base de datos');
        });
        yield initializeCompetitorsData();
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
const testConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log('Connection has been established successfully.');
        yield syncroModel();
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
exports.default = sequelize;
testConnection();
