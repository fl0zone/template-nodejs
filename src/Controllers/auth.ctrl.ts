import { Request, Response } from "express";
import { LoginRequestBody, RegisterRequestBody } from "../types/auth.types";
import { PrismaClient } from "@prisma/client";
import { comparePassword, hashPassword } from "../utils/bcryp";
import { generateToken } from "../utils/authToken";
import { CustomRequest } from "../types/custom.types";
import ValidationError from "../errors/validationError";
import CustomError from "../errors/customError";
const prisma = new PrismaClient();
export const registerCtrl = async (req: Request, res: Response) => {
  const { name, email, password, role }: RegisterRequestBody = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    const user = await prisma.users.create({
      data: { name, email, password: hashedPassword, role },
    });
    const token = generateToken(user.id);
    return res.json({ token });
  } catch (error: any) {
    console.log(error.message);
    return res.json({ error: error.message });
  }
};
export const loginCtrl = async (req: CustomRequest, res: Response) => {
  const { password }: LoginRequestBody = req.body;
  console.log({ password });
  try {
    const user = req.user;
    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      console.log("password invalido");
      throw new ValidationError("invalid password", 401);
    }
    console.log("validpassword-->", validPassword);
    const token = generateToken(user.id);
    return res.json({ token, user });
  } catch (error: any) {
    console.log(error.message);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.json({ error: error.message });
  }
};
