import { Router } from "express";
import{createUser} from"../Controllers/usersCtrl"

export const userRouter=Router();

userRouter.post('/NewUser',createUser);