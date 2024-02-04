import { Request, Response, NextFunction } from "express";
import customError from "../tools/error";
import logger from "../tools/logger";

 
export default function APIerrorHandler(error:customError,req:Request,res:Response) {
    logger(error)
    const APIerror:Record<string,any>={}
    if (error.code<10) {
        APIerror.type="Authentication"
    } else if (error.code<20) {
        APIerror.type="Authorization"
    } else if (error.code<30) {
        APIerror.type="Validation"
    } else if(error.code<40) {
        APIerror.type="ConnectionFailed"
    } else if (error.code==50) {
        APIerror.type="General"
    }
    APIerror.name=error.name
    APIerror.message=error.message
    APIerror.status=error.status || 400
    APIerror.code=error.code
    APIerror.errorInfo=error.info
    res.status(error.status || 400).json(APIerror)
}