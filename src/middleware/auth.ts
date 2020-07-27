import { Response, NextFunction } from "express";
import { CustomRequest, AuthToken } from "../types/interface";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/config";

const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res
      .status(401)
      .json({ msg: "No JWT token found, authorization denied." });
  }

  try {
    const decodedToken = jwt.verify(token, jwtSecret) as AuthToken;
    req.user = decodedToken.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid JWT token" });
  }
};

export default auth;
