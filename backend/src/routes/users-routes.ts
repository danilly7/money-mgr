import { Router } from 'express';
import { getAllUsers, getUserById, postUser, updateUser } from '../controllers/users';
import { authUser } from '../middlewares/auth.middleware';

const usersRouter = Router();

usersRouter.get("/", getAllUsers);
usersRouter.get("/:id", getUserById);
usersRouter.post("/", authUser, postUser); //tmb aquí hay authUser
usersRouter.put("/:id", authUser, updateUser); //en este caso solo update hace el authUser

export default usersRouter;