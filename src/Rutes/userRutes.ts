import { Router } from "express";
import{createUser} from"../Controllers/UsersControllers-Grupo A"
import validateFieldSignUp from "../validator/validateFieldSignUp";

export const userRouter=Router();

userRouter.post('/NewUser',validateFieldSignUp,createUser);