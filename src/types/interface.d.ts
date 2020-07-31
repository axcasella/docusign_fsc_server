import mongoose from "mongoose";
import { Request } from "express";
import { Role } from "../utils/utils";

export interface User extends mongoose.Document {
  id: string;
  email: string;
  name: string;
  password: string;
  role: Role;
}

export interface CustomRequest extends Request {
  user?: User;
}

export interface AuthToken {
  user: User;
}

export interface AzureLoginResponse {
  data: {
    access_token: string;
  };
}
