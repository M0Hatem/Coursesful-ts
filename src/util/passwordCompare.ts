import bcrypt from "bcrypt";

const passwordCompare = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
export default passwordCompare;
