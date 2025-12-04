"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../controllers/users");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const usersRouter = (0, express_1.Router)();
usersRouter.get("/", users_1.getAllUsers);
usersRouter.get("/:id", users_1.getUserById);
usersRouter.post("/", users_1.postUser);
usersRouter.put("/:id", auth_middleware_1.authUser, users_1.updateUser); //en este caso solo update hace el authUser
exports.default = usersRouter;
