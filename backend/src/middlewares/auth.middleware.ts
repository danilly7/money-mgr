import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import models from '../models';

const {User} = models;

//middleware de autenticación con Firebase
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        //verificar y decodificar el token de Firebase
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        //buscar el usuario en la base de datos usando el uid de Firebase
        const user = await User.findOne({ where: { uid: decodedToken.uid } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        //asignar tanto el uid como el id al objeto req.user
        req.user = {
            uid: decodedToken.uid,
            id: user.id, //aquí asignas el id de la base de datos
        };
        
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
};