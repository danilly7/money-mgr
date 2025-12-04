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
exports.authUser = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const user_1 = __importDefault(require("../models/user"));
//middleware de autenticación con Firebase
const authUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized: No token provided" }); // Aquí enviamos la respuesta sin return
        return; // Después de la respuesta, salimos del middleware
    }
    const token = authHeader.split(" ")[1];
    try {
        //verificar y decodificar el token de Firebase
        const decodedToken = yield firebase_admin_1.default.auth().verifyIdToken(token);
        //buscar el usuario en la base de datos usando el uid de Firebase
        const user = yield user_1.default.findOne({ where: { uid: decodedToken.uid } });
        if (!user) {
            res.status(404).json({ message: "User not found" }); // Respuesta sin return
            return;
        }
        //asignar tanto el uid como el id al objeto req.user
        req.user = {
            uid: decodedToken.uid,
            id: user.id, //aquí asignas el id de la base de datos
        };
        next(); //next operation
    }
    catch (error) {
        console.error("Token verification failed:", error);
        res.status(403).json({ message: "Forbidden: Invalid token" });
    }
});
exports.authUser = authUser;
