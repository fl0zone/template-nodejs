import { Router } from "express";
import{createUser} from"../Controllers/UsersControllers-Grupo A"

export const userRouter=Router();

userRouter.post('/NewUser',createUser);