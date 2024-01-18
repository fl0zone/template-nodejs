import express, { Router, RequestHandler } from "express";
import fs from "fs";
import { loginCtrl, registerCtrl } from "../controllers/auth.ctrl";

const router: Router = express.Router();
const pathRouter: string = __dirname;

const removeExtension = (fileName: string): string => {
  return fileName.split(".").shift() || "";
};

fs.readdirSync(pathRouter).filter((file: string) => {
  const fileWithOutExt: string = removeExtension(file);

  const skip: boolean = ["index"].includes(fileWithOutExt);

  if (!skip) {
    const routePath: string = `/${fileWithOutExt}`;

    const routeModule: RequestHandler =
      require(`./${fileWithOutExt}.router`).default;

    router.use(routePath, routeModule);
  }
});
router.use('/v2',(req,res)=>{res.send('hola')})
export default router;
