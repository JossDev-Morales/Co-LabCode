import dotenv from "dotenv";
dotenv.config();
import { env } from "node:process";
import { TokenDecoder, TokenSpreed } from "../tools/tokenSystem";

const secretKeyjwt: string = String(env.secretKeyjwt);
export const Tokens = new TokenSpreed(secretKeyjwt);
export const TokenTools = new TokenDecoder(secretKeyjwt);
