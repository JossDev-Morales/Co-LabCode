import { Request, request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { authenticationPayload } from "./tools/tokenSystem";
import { UUID } from "crypto";

declare global {
  namespace Express {
    interface Request {
      info: {token:string}|Record<string, string|Record<string,any>>;
      tokenInfo: authenticationPayload | JwtPayload | Record<string, any>;
    }
  }
}
