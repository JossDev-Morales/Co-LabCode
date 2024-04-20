import { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, RequestHandler, Response } from "express";
import customError from "../tools/error";
import { TokenDecoder, authenticationPayload } from "../tools/tokenSystem";
import { TokenFront, TokenTools } from "../tokens/tokens";
import tokenServices from "../services/token.services";
import { UUID } from "crypto";

async function tokenGetterFront(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization as string;
    if (!TokenDecoder.isExpired(token)) {
      const payload = TokenFront.decode(token);
      req.tokenInfo = payload;
    } else {
      throw new customError("ExpiredToken", "El token ah expirado", 403, 2);
    }

    next();
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
function AuthTokenGetter(method:"headers"|"params"|"body"|"query"){
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  )=>{
    try {
      let token:string=''
      if (method=='headers') {
        if (req.headers.authorization===undefined) {
          throw new customError("MissedAuthToken","Un token de autenticacion debe ser proporcionado",401,8,{
            method:"Headers"
          })
        }
        token= (req.headers.authorization as string).split(" ")[1]
        console.log(token);
        
      }else if(method=='params'){
        if (req.params.token===undefined) {
          throw new customError("MissedAuthToken","Un token de autenticacion debe ser proporcionado",401,8,{
            method:"Params"
          })
        }
        token= req.params.token
      } else if(method=='body'){
        if (req.body.token===undefined) {
          throw new customError("MissedAuthToken","Un token de autenticacion debe ser proporcionado",401,8,{
            method:"Body"
          })
        }
        token= req.body.token
      } else if (method=='query'){
        if (req.query.token===undefined) {
          throw new customError("MissedAuthToken","Un token de autenticacion debe ser proporcionado",401,8,{
            method:"Query"
          })
        }
        token = req.query.token as string
      }
      if (!TokenDecoder.isExpired(token)) {
        const payload: JwtPayload = TokenTools.decode(token);
        if (payload.iss=="AUTH") {
          const [isInBlacklist, blacklistResponse] = await tokenServices.findSession(payload.jti as UUID);
        if (!isInBlacklist) {
          req.tokenInfo = payload;
          req.info={token}
          next();
        } else {
          throw new customError("BlackList","El token se encuentra en lista negra, se rechazo la conexion",403,3)
        }
        }else{
          req.tokenInfo = payload;
          req.info={token}
          next();
        }
      } else {
        throw new customError("ExpiredToken", "El token ah expirado", 403, 2);
      }
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
}
export { tokenGetterFront,AuthTokenGetter };
