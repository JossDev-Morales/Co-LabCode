import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";
import { signUpSchema } from "../validations/Schemas";
import customError from "../tools/error";

export function schemaValidator(
  schema: Schema,
  method: "headers" | "params" | "body" | "query"
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const value =
        method == "headers"
          ? {authorization:req.headers.authorization?.split(" ")[1]}
          : method == "params"
          ? req.params
          : method == "query"
          ? req.query
          : req.body;
      const { error } = schema.validate(value, { abortEarly: false });
      if (error) {
        const details = error.details.map((err) => {
          return {
            key: err.context?.key,
            value: err.context?.value,
            message: err.message,
          };
        });
        throw new customError("MissedData","Informacion invalida, alterada o con un formato invalido ah sido ingresada",400,21,{
          method,
          details
        })
      }else {
        next()
      }
    } catch (error) {
      next(error);
    }
  };
}
