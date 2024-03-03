import { Application } from "express";
import generalErrorHandler from "./general.error.handler";
import APIerrorHandler from "./api.error.handler";

export default function errorHandlers(app:Application) {
    app.use(APIerrorHandler)
    app.use(generalErrorHandler)
}