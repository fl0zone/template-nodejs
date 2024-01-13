import { PrismaClient } from '@prisma/client';
import {Request,Response} from 'express';

const prisma=new PrismaClient();

export const createUser= async (req:Request,res:Response)=>{
try{
const{UserName,contrasena,Email}=req.body;
const usuarioExistente=await prisma.user.findFirst({
where:{Email},

});
if(usuarioExistente){
return res.status(400).json({error:'The user already exist'})

}
const newUser=await prisma.user.create({
data:{
UserName,
Email,
contrasena,


  },
 });
 return res.json(newUser);
 }catch(error){
console.error('Error al crear usuario', error);
res.status(500).json({error:'Error al Crear Usurio'});
 }
};






