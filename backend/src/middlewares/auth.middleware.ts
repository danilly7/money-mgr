import { Request, Response, NextFunction, RequestHandler} from "express";
import admin from "firebase-admin";
import User from "../models/user";

declare global {
    namespace Express {
        interface Request {
            user?: {
                uid: string;
                id: number;
            };
        }
    }
}

//middleware de autenticación con Firebase
export const authUser: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized: No token provided" });  // Aquí enviamos la respuesta sin return
        return;  // Después de la respuesta, salimos del middleware
    }

    const token = authHeader.split(" ")[1];

    try {
        //verificar y decodificar el token de Firebase
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        //buscar el usuario en la base de datos usando el uid de Firebase
        const user = await User.findOne({ where: { uid: decodedToken.uid } });

        if (!user) {
            res.status(404).json({ message: "User not found" });  // Respuesta sin return
            return;
        }

        //asignar tanto el uid como el id al objeto req.user
        req.user = {
            uid: decodedToken.uid,
            id: user.id, //aquí asignas el id de la base de datos
        };
        
        next(); //next operation
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(403).json({ message: "Forbidden: Invalid token" });
    }
};