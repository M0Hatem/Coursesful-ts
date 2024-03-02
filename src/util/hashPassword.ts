import bcrypt from "bcrypt";

export async function getHashedPassword(password: string) {
  return await bcrypt.hash(password, 12);
}
