import jwt from "jsonwebtoken";
import axios from "axios";
import bcrypt from "bcrypt";
import querystring from "querystring";
import {
  jwtSecret,
  azureADURL,
  resource,
  client_id,
  username,
  password,
  client_secret,
} from "../config/config";
import { AzureLoginResponse } from "../types/interface";

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

// returns JWT token from Azure AD for Dynamics ops
export const getDynamicsAccessToken = async (): Promise<string> => {
  try {
    const body = {
      resource: resource,
      client_id: client_id,
      grant_type: "password",
      username: username,
      password: password,
      client_secret: client_secret,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const response = (await axios.post(
      azureADURL,
      querystring.stringify(body),
      config
    )) as AzureLoginResponse;

    if (response.data.access_token) {
      return response.data.access_token;
    }

    return "failed to get token";
  } catch (err) {
    console.error(err.message);
    return err.message;
  }
};
