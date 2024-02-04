import { NextFunction, Request, Response } from "express";
import { authServices } from "../services/auth.services";
import { TokenTools, Tokens } from "../tokens/tokens";
import mailer from "../tools/mailer";
import blacklist from "../db/models/Blacklist.sessions";
import { TokenDecoder } from "../tools/tokenSystem";
import { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import tokenServices from "../services/token.services";
import customError from "../tools/error";
import { UUID } from "crypto";
import bcrypt from "bcrypt";
import CredentialsModel from "../db/models/Model.Credentials";
import { credentialsServices } from "./credentials.services";
import { usersServices } from "../services/users.services";
export interface signinInfo {
  mail: string;
  password: string;
  recoveryMail: string;
  colabname: string;
  phone: string;
  prefix: string;
}
async function signUpController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { mail, password, recoveryMail, colabname, phone, prefix } =
      req.body as unknown as signinInfo;
    const { credentialId, userId } = await authServices.signUpService({
      colabname,
      mail,
      password,
      phone,
      prefix,
      recoveryMail,
    });
    mailer.sendVerificationMail({
      colabname,
      mail,
      verificationToken: Tokens.verification(credentialId),
    });
    const authTokens = Tokens.auth({
      credentialsId: credentialId,
      role: "USER",
      userId: userId,
      colabname,
    });
    res.status(201).json({
      userStatus: "unverified",
      tokens: authTokens,
    });
  } catch (error) {
    next(error);
  }
}
async function logoutController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { jti, credentialsId } = req.tokenInfo;
    await blacklist.create({
      sessionId: jti,
      credentialsId,
      timestamp: TokenDecoder.timestamp(req.headers.authorization as string),
    });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}
async function refreshingController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token=req.info.token as string
    const authTokens = TokenTools.refresh(token);
    res.status(200).json(authTokens);
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      next(
        new customError("InvalidToken", error.message, 403, 1, {
          cause: (error as JsonWebTokenError).cause,
          name: (error as JsonWebTokenError).name,
          message: (error as JsonWebTokenError).message,
        })
      );
    } else {
      next(error);
    }
  }
}
async function signInController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { password, mail } = req.body;
    const credentials = await credentialsServices.getCredentialsByMail(mail);
    if (!credentials) {
      throw new customError(
        "InvalidCredentials",
        "Este mail no tiene un usuario asociado",
        400,
        4
      );
    }
    if (!(await bcrypt.compare(password, credentials.password))) {
      throw new customError(
        "InvalidCredentials",
        "Contraseña incorrecta",
        404,
        5
      );
    }
    const { colabname, id } = await usersServices.getUserByCredentials(
      credentials.id
    );
    const authTokens = Tokens.auth({
      credentialsId: credentials.id,
      role: credentials.role,
      colabname,
      userId: id,
    });
    res.status(200).json(authTokens);
  } catch (error) {
    next(error);
  }
}
async function unprotectUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {credentialsId} = req.tokenInfo
    await authServices.unprotect(credentialsId)
  } catch (error) {
    next(error);
  }
}
export {
  signUpController,
  logoutController,
  refreshingController,
  signInController,
};
