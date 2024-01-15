import { Request, Response, NextFunction } from "express";
import customError from "../tools/error";

 
export default function APIerrorHandler(error:customError,req:Request,res:Response) {
    const APIerror:Record<string,any>={}
    if (error.code<10) {
        APIerror.type="Authentication error"
    } else if (error.code<20) {
        APIerror.type="Authorization error"
    } else if (error.code<30) {
        APIerror.type="Validation error"
    }else if (error.code==50) {
        APIerror.type="General error"
    }
    APIerror.name=error.name
    APIerror.message=error.message
    APIerror.status=error.status || 400
    APIerror.code=error.code
    APIerror.errorInfo=error.info
    res.status(error.status || 400)
}