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
import CredentialsModel, {
  authCredentialsInfo,
} from "../db/models/Model.Credentials";
import { credentialsServices } from "../services/credentials.services";
import { usersServices } from "../services/users.services";
import { timeComparer } from "../tools/time.comparer";
import { URL } from "url";
import { actionsServices } from "../services/actions.services";

export interface signinInfo {
  mail: string;
  password: string;
  recoveryMail: string;
  colabname: string;
  phone: string;
  prefix: string;
  role: string;
}
async function signUpController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { mail, password, recoveryMail, colabname, phone, prefix, role } =
      req.body as unknown as signinInfo;
    const { credentialId, userId } = await authServices.signUpService({
      colabname,
      mail,
      password,
      phone,
      prefix,
      recoveryMail,
      role,
    });
    
    const url = new URL(req.url, `http://${req.headers.host}`);
    await mailer.sendVerificationMail({
      colabname,
      mail,
      verificationToken: `${
        url.origin
      }/colab-api/v1/auth/verify?token=${Tokens.verification(credentialId)}`,
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
async function verify(req: Request, res: Response, next: NextFunction) {
  try {
    const { identifier, } = req.tokenInfo;

    if (await credentialsServices.userExist(identifier)) {
      const creds=await credentialsServices.getCredentialsById(identifier)
      if (!creds.verified) {
        await credentialsServices.verify(identifier);
        res.sendStatus(200);
      } else {
        res.status(400).json({message:"Usuario previamente verificado"})
      }
    }else{
      throw new customError("nonexistentUser","Este usuario no existe",404,7)
    }
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
    const token = req.info.token as string;
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
    if (!credentials.verified) {
      throw new customError(
        "RejectedAction",
        "Accion rechazada por falta de acceso o bloqueo de esta misma",
        403,
        6,{
          reason:{name:"UnverifiedAccount",via:"signin"}
        }
      );
    }
    if (credentials.protected) {
      throw new customError(
        "RejectedAction",
        "Accion rechazada por falta de acceso o bloqueo de esta misma",
        403,
        6,{
          reason:{name:"ProtectedAccount",via:"signin"}
        }
      );
    }
    if (!(await bcrypt.compare(password, credentials.password))) {
      console.log("not pass");
      
      const failedAttemptsDate = await credentialsServices.getAttemptDate(
        credentials.id
      );
      if (!timeComparer(new Date(failedAttemptsDate))) {
        await credentialsServices.updateFailedAttempDate(credentials.id);
        await credentialsServices.attemptsToOne(credentials.id);
      } else {
        if ((await credentialsServices.getAttemptsNumber(credentials.id)) < 4) {
          await credentialsServices.adAttempt(credentials.id);
        } else {
          await credentialsServices.protect(credentials.id);
        }
      }
      throw new customError(
        "InvalidCredentials",
        "Contraseña incorrecta",
        404,
        5
      );
    }
    
    const user = await usersServices.getUserByCredentials(
      credentials.id
    );
    console.log(credentials);
    
    const authTokens = Tokens.auth({
      credentialsId: credentials.id,
      role: credentials.role,
      userId: user.id,
    });
    res.status(200).json(authTokens);
  } catch (error) {
    console.log(error);
    
    next(error);
  }
}
async function unprotectUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { credentialsId } = req.tokenInfo;
    await credentialsServices.unprotect(credentialsId);
    await credentialsServices.attemptsToZero(credentialsId);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}
async function getRecoveryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { mail }: { mail: string } = req.body;
    const credentials = await credentialsServices.getCredentialsByMail(mail);
    if (credentials==null) {
      throw new customError("nonexistentUser","Este usuario no existe",404,7)
    }
    const { colabname } = await usersServices.getUserByCredentials(credentials.id);
    mailer.sendRecoveryMail({
      mail,
      recoveryToken: Tokens.recovery(credentials.id),
      colabname,
    });
    res.status(200).json({
      colabname,
      mail,
    });
  } catch (error) {
    next(error);
  }
}
async function recoveryCredentials(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { identifier } = req.tokenInfo;
    const { mail, password }: authCredentialsInfo = req.body;
    if (await credentialsServices.userExist(identifier)) {
      throw new customError("nonexistentUser","Este usuario no existe",404,7)
    }
    const { colabname } = await usersServices.getUserByCredentials(
      identifier
    );
    await credentialsServices.updateAuhtCredentials(identifier, {
      mail,
      password,
    });
    res.status(200).json({ colabname, mail });
  } catch (error) {
    next(error);
  }
}
async function changePasswordController(req:Request,res:Response,next:NextFunction) {
  try {
    const {newPassword,oldPassword}=req.body
    const queryAuthInfo=req.tokenInfo
    if (await credentialsServices.userExist(queryAuthInfo.credentialsId)) {
      throw new customError("nonexistentUser","Este usuario no existe",404,7)
    }
    const credentials=await credentialsServices.getCredentialsById(queryAuthInfo.credentialsId)
    if (!(await bcrypt.compare(oldPassword, credentials.password))) {
      throw new customError(
        "InvalidCredentials",
        "Contraseña incorrecta",
        404,
        5
      );
    }
    await credentialsServices.updateAuhtCredentials(credentials.id,{password:newPassword})
    const actionId=await actionsServices.newAction(credentials.id,oldPassword,'CREDENTIALS','PASSWORD')
    mailer.sendUndoMail({mail:credentials.mail,colabname:queryAuthInfo.colabname,undoToken:Tokens.undo(credentials.id,actionId)})
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
}
async function changeMailController(req:Request,res:Response,next:NextFunction) {
  try {
    const {newMail}=req.body
    const queryAuthInfo=req.tokenInfo
    const oldMail=(await credentialsServices.getCredentialsById(queryAuthInfo.credentialsId)).mail
    await credentialsServices.updateAuhtCredentials(queryAuthInfo.credentialsId,{mail:newMail})
    const actionId=await actionsServices.newAction(queryAuthInfo.credentialsId,oldMail,"CREDENTIALS","MAIL")
    mailer.sendUndoMail({mail:oldMail,colabname:queryAuthInfo.colabname,undoToken:Tokens.undo(queryAuthInfo.credentialsId,actionId)})
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
}
async function undoAction(req:Request,res:Response,next:NextFunction) {
  try {
    const {actionId,identifier}=req.tokenInfo
    if (await credentialsServices.userExist(identifier)) {
      throw new customError("nonexistentUser","Este usuario no existe",404,7)
    }
    const action=await actionsServices.getAction(actionId)
    if (action.actionType==='CREDENTIALS') {
      if (action.focus==='MAIL') {
        await credentialsServices.updateAuhtCredentials(identifier,{mail:action.oldValue})
      }else{
        await credentialsServices.updateAuhtCredentials(identifier,{password:action.oldValue})
      }
    }
  } catch (error) {
    next(error)
  }
}
export {
  signUpController,
  logoutController,
  refreshingController,
  signInController,
  unprotectUserController,
  getRecoveryController,
  recoveryCredentials,
  verify,
  changeMailController,
  changePasswordController,
  undoAction
};
