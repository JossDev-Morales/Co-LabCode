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
export default function generalErrorHandler(
  nexterror: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (nexterror instanceof customError) {
      next(nexterror)
    }
    if (
        nexterror instanceof TimeoutError ||
        nexterror instanceof ConnectionError ||
        nexterror instanceof ConnectionAcquireTimeoutError ||
        nexterror instanceof ConnectionRefusedError ||   
        nexterror instanceof ConnectionTimedOutError ||
        nexterror instanceof InvalidConnectionError
        ) {
        res.status(500).json({
            status:500,
            code:50,
            type:"Database error",
            name:nexterror.name,
            message:nexterror.message,
            img:"https://http.cat/500"
        })
    }
    if(nexterror instanceof ValidationError){
        res.status(400).json({
            status:400,
            code:50,
            type:"Database validation error",
            name:nexterror.name,
            message:nexterror.message,
            errors: (nexterror as ValidationError).errors,
            img:"https://http.cat/400"
        })
    }
    if (nexterror !instanceof DatabaseError) {
        throw nexterror
    }
  } catch (error) {
    res.status(500).json({
        status:500,
        code:50,
        type:"Server error",
        name:(error as Error).name,
        message: (error as Error).message,
        img:"https://http.cat/500"
    })
  }
}
