import {Router } from "express";
import {BR} from './baseroot'
import {tokenGetterFront,AuthTokenGetter} from "../middlewares/getToken.middle";
import {signUpController,logoutController, refreshingController, signInController, unprotectUserController, getRecoveryController, recoveryCredentials, verify, changeMailController, changePasswordController, undoAction, } from "../controlllers/auth.controller"
import { schemaValidator } from "../middlewares/schemaValidator";
import { changeMailSchema, changePasswordSchema, signInSchema, signUpSchema, tokenAuthSchema, tokenGetterSchema } from "../validations/Schemas";
const authRouter=Router()
//routes
authRouter.post(BR+"/auth/signup",schemaValidator(signUpSchema,"body"),signUpController)//pass
authRouter.post(BR+"/auth/verify",schemaValidator(tokenGetterSchema,"query"),AuthTokenGetter("query"),verify)//pass
//authRouter.get(BR+"/auth/signin/google")
authRouter.post(BR+"/auth/logout",schemaValidator(tokenAuthSchema,"headers"),AuthTokenGetter('headers'),logoutController)//pass
authRouter.get(BR+"/auth/refresh",schemaValidator(tokenAuthSchema,"headers"),AuthTokenGetter('headers'),refreshingController)//pass
authRouter.post(BR+"/auth/signin",schemaValidator(signInSchema,"body"),signInController)//pass
authRouter.get(BR+"/auth/unprotect",schemaValidator(tokenGetterSchema,"query"),AuthTokenGetter('query'),unprotectUserController)//pass
authRouter.post(BR+"/auth/recovery",getRecoveryController)//pass
authRouter.put(BR+"/auth/recovery",schemaValidator(tokenGetterSchema,"query"),AuthTokenGetter('query'),recoveryCredentials)//pass
authRouter.put(BR+"/auth/me/mail",schemaValidator(tokenAuthSchema,"headers"),schemaValidator(changeMailSchema,"body"),AuthTokenGetter('headers'),changeMailController)//pass
authRouter.put(BR+"/auth/me/password",schemaValidator(tokenAuthSchema,"headers"),schemaValidator(changePasswordSchema,"body"),AuthTokenGetter('headers'),changePasswordController)//pass
authRouter.post(BR+"/auth/undo",schemaValidator(tokenGetterSchema,"query"),AuthTokenGetter('query'),undoAction)//pass



export default authRouter