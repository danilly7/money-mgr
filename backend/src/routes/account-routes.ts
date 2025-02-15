import { Router } from "express";
import { 
    getAllAccounts, 
    getAccountById, 
    postAccount, 
    updateAccount, 
    deleteAccount 
} from "../controllers/accounts";
import { authenticateUser } from "../middlewares/auth.middleware";

const accountsRouter = Router();

accountsRouter.use(authenticateUser); // Aplica autenticación a todas las rutas

accountsRouter.get("/", getAllAccounts);
accountsRouter.get("/:id", getAccountById);
accountsRouter.post("/", postAccount);
accountsRouter.put("/:id", updateAccount);
accountsRouter.delete("/:id", deleteAccount);

export default accountsRouter;
