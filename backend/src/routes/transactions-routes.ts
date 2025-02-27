import { Router } from 'express';
import { deleteTransaction, getAllTransactions, getTransactionById, postTransaction, updateTransaction } from '../controllers/transactions';
import { authUser } from '../middlewares/auth.middleware';

const transactionsRouter = Router();

transactionsRouter.use(authUser);

transactionsRouter.get("/", getAllTransactions);
transactionsRouter.get("/:id", getTransactionById);
transactionsRouter.post("/", postTransaction);
transactionsRouter.put("/:id", updateTransaction);
transactionsRouter.delete("/:id", deleteTransaction);

export default transactionsRouter;