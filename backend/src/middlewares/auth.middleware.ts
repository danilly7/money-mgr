import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

declare global {
    namespace Express {
        interface Request {
            user?: {
                uid: string;
            };
        }
    }
}

// Middleware de autenticación con Firebase
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        // Verificar y decodificar el token de Firebase
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        // Asignamos el uid de Firebase al objeto req.user
        req.user = { uid: decodedToken.uid };
        
        next(); // Continuamos con la siguiente operación
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
};