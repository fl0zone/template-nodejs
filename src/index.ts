import { PrismaClient } from "@prisma/client";
import express from "express";


const prisma= new PrismaClient();

const app=express();

const port = process.env.PORT ?? 5432 ;
app.use(express.json());



app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });