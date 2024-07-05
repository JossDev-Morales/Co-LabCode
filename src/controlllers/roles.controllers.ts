import { NextFunction, Request, Response } from "express";
import { rolesServices } from "../services/roles.services";

async function getAllRoles(req:Request,res:Response,next:NextFunction) {
    try {
        const {q} =req.query as {q:string}
        if(q){
            console.log('query');
            
            let roles = await rolesServices.getRolesByQuery(q)
            res.json({roles})
        } else {
            let roles = await rolesServices.getAllRoles()
            res.json({roles})
        }
    } catch (error) {
        next(error)
    }
}
export {
    getAllRoles
}