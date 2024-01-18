import jwt from "jsonwebtoken";
const { JWT_SECRET } = process.env;
export const generateToken = (id: number) => {
  //genera token con jesonwebtoken
  const token = jwt.sign({ id }, process.env.JWT_SECRET || "");
  return token;
};
export const verifyToken = (token: string) => {
  //verifica token con jesonwebtoken
  const decoded = jwt.verify(token, JWT_SECRET || "");
  return decoded;
};
