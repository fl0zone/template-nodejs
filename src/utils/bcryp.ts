import bcrypt from "bcryptjs";
export const hashPassword = async (password: string) => {
  const salt: string = await bcrypt.genSalt(10);
  const hash: string = await bcrypt.hash(password, salt);
  return hash;
};
export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};
