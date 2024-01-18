import express from "express";
import { loginCtrl, registerCtrl } from "../controllers/auth.ctrl";
import { checkEmailDuplicate } from "../middlewares/checkEmailDuplicate";
import validateFieldSignUp from "../validator/validateFieldSignUp";
import { checkEmailExist } from "../middlewares/checkEmailExist";
import validateFieldLogIn from "../validator/validateFieldLogIn";
const router = express.Router();
router.post(
  "/register",
  validateFieldSignUp,
  checkEmailDuplicate,
  registerCtrl
);
router.post("/login", validateFieldLogIn, checkEmailExist, loginCtrl);
export default router;
