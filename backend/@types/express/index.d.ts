import { Request } from "express";

declare module "express-serve-static-core" {
    interface Request {
        user?: { id: number }; // Ajusta el tipo según lo que almacenas en req.user
    }
}