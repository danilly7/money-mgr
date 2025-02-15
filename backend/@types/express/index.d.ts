import { Request } from "express";

//importante para el middleware auth. Sin esto salta linter todo el rato.
declare module "express-serve-static-core" {
    interface Request {
        user?: {
            uid: string;
            id: number;
        };
    }
}