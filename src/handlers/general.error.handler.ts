import { Request, Response, NextFunction } from "express";
import customError from "../tools/error";
import {
  ValidationError,
  TimeoutError,
  ConnectionError,
  ConnectionAcquireTimeoutError,
  ConnectionRefusedError,
  ConnectionTimedOutError,
  InvalidConnectionError,
  DatabaseError,
} from "sequelize";
import { error } from "console";
export default function generalErrorHandler(
  nexterror: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    
    if (
        nexterror instanceof TimeoutError ||
        nexterror instanceof ConnectionError ||
        nexterror instanceof ConnectionAcquireTimeoutError ||
        nexterror instanceof ConnectionRefusedError ||   
        nexterror instanceof ConnectionTimedOutError ||
        nexterror instanceof InvalidConnectionError
        ) {
        console.warn("Error de tipo: ","Database error")
        res.status(500).json({
            status:500,
            code:50,
            type:"Database error",
            name:nexterror.name,
            message:nexterror.message,
            img:"https://http.cat/500"
        })
    } else if(nexterror instanceof ValidationError){
      console.warn("Error de tipo: ","Database validation error")
        res.status(400).json({
            status:400,
            code:51,
            type:"Database validation error",
            name:nexterror.name,
            message:nexterror.message,
            errors: (nexterror as ValidationError).errors,
            img:"https://http.cat/400"
        })
    } else if (nexterror !instanceof DatabaseError) {
        throw nexterror
    } else {
      console.warn("Error de tipo: ","Server error")
      res.status(500).json({
          status:500,
          code:52,
          type:"Server error",
          name:nexterror.name,
          message: nexterror.message,
          img:"https://http.cat/500"
      })
    }
  } catch (error) {
    
  }
}
