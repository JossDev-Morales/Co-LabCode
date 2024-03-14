import {Router } from "express";
import {BR} from './baseroot'
import {tokenGetterFront,AuthTokenGetter} from "../middlewares/getToken.middle";
import {signUpController,logoutController, refreshingController, signInController, unprotectUserController, getRecoveryController, recoveryCredentials, verify, changeMailController, changePasswordController, undoAction, } from "../controlllers/auth.controller"
const authRouter=Router()
//routes
authRouter.post(BR+"/auth/signup",signUpController)//pass
authRouter.post(BR+"/auth/verify",AuthTokenGetter("query"),verify)//pass
//authRouter.get(BR+"/auth/signin/google")
authRouter.post(BR+"/auth/logout",AuthTokenGetter('headers'),logoutController)//pass
authRouter.get(BR+"/auth/refresh",AuthTokenGetter('headers'),refreshingController)//pass
authRouter.post(BR+"/auth/signin",signInController)
authRouter.get(BR+"/auth/unprotect",AuthTokenGetter('query'),unprotectUserController)
authRouter.post(BR+"/auth/recovery",getRecoveryController)
authRouter.put(BR+"/auth/recovery",AuthTokenGetter('query'),recoveryCredentials)
authRouter.put(BR+"/auth/me/credentials/mail",AuthTokenGetter('headers'),changeMailController)
authRouter.put(BR+"/auth/me/credentials/password",AuthTokenGetter('headers'),changePasswordController)
authRouter.post(BR+"/auth/undo",AuthTokenGetter('headers'),undoAction)



export default authRouter