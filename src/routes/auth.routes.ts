import {Router } from "express";
import {BR} from './baseroot'
import {tokenGetterFront,AuthTokenGetter} from "../middlewares/getToken.middle";
import {signUpController,logoutController, refreshingController, signInController, } from "../controlllers/auth.controller"
const authRouter=Router()
//routes
authRouter.get(BR+"/auth/signup",signUpController)
//authRouter.get(BR+"/auth/signin/google")
authRouter.post(BR+"/auth/logout",AuthTokenGetter('headers'),logoutController)
authRouter.get(BR+"/auth/refresh",AuthTokenGetter('body'),refreshingController)
authRouter.post(BR+"/auth/signin",signInController)
authRouter.put(BR+"/auth/unprotect/:token",AuthTokenGetter('params'))
authRouter.put(BR+"/auth/recovery")




export default authRouter