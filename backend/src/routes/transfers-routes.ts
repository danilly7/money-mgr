import { Router } from 'express';
import { deleteTransfer, getAllTransfers, getTransferById, postTransfer, updateTransfer } from '../controllers/transfers';
import { authUser } from '../middlewares/auth.middleware';

const transfersRouter = Router();

transfersRouter.use(authUser);

transfersRouter.get("/", getAllTransfers);
transfersRouter.get("/:id", getTransferById);
transfersRouter.post("/", postTransfer);
transfersRouter.put("/:id", updateTransfer);
transfersRouter.delete("/:id", deleteTransfer);

export default transfersRouter;