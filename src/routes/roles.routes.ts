import {Router } from "express";
import {BR} from './baseroot'
import { getAllRoles } from "../controlllers/roles.controllers";

const rolesRouter=Router()
rolesRouter.get(BR+"/roles",getAllRoles)
export default rolesRouter