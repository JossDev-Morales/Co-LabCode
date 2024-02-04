import dotenv from "dotenv";
dotenv.config();
import { env } from "node:process";
import { TokenDecoder, TokenSpreed } from "../tools/tokenSystem";

const secretKeyjwt: string = String(env.secretKeyBack);
export const Tokens = new TokenSpreed(secretKeyjwt);
export const TokenTools = new TokenDecoder(secretKeyjwt);
export const TokenFront=new TokenDecoder(String(env.secretKeyFront))