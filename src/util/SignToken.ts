import jwt from "jsonwebtoken";

export function signToken(payload: { userId: string; email: string }): string {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}
