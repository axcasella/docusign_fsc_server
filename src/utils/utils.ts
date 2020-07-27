import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/config";
import bcrypt from "bcrypt";

const tokenExpiration = 360000000000000;

export const generateToken = async (id: String, email: String) => {
  try {
    const payload = {
      user: { id: id, email: email },
    };

    return await jwt.sign(payload, jwtSecret, {
      expiresIn: tokenExpiration,
    });
  } catch (err) {
    console.error(err.message);
    throw Error(err);
  }
};

export const getPasswordHash = async (password: String) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    console.error(err.message);
    throw Error(err);
  }
};

export const parseBearerToken = (token: string): string => {
  const tokenStr = token.split(" ");
  return tokenStr[1];
};
