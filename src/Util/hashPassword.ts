import bcrypt from "bcrypt";

export async function getHashedPassword(password: string) {
  try {
    return await bcrypt.hash(password, 12);
  } catch (e) {
    throw e;
  }
}
