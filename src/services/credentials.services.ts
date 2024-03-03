import { UUID } from "crypto";
import CredentialsModel, { authCredentialsInfo, credentialModelInfo } from "../db/models/Model.Credentials";

export class credentialsServices{
    static async userExist(id:UUID){
        try {
            const response = await this.getCredentialsById(id)
            return response!=null
        } catch (error) {
            throw error
        }
    }
    static async getCredentialsById(credentialsId:UUID){
        try {
            const response= await CredentialsModel.findByPk(credentialsId) as Promise<credentialModelInfo>|Record<string,any>
            return response
        } catch (error) {
            throw error
        }
    }
    static async getCredentialsByMail(mail:string){
        try {
            const response = await CredentialsModel.findOne({where:{mail:mail}}) as Record<string,any>|Promise<credentialModelInfo>
            return response
        } catch (error) {
            throw error
        }
    }
    static async getAttemptDate(credentialsId:UUID){
        try {
            const {failedAttemptsDate}=await this.getCredentialsById(credentialsId)
            return failedAttemptsDate
        } catch (error) {
            throw error
        }
    }
    static async getAttemptsNumber(credentialsId:UUID):Promise<number>{
        try {
            const {failedAttempts}=await this.getCredentialsById(credentialsId)
            return failedAttempts
        } catch (error) {
            throw error
        }
    }
    static async adAttempt(credentialsId:UUID){
        try {
            await CredentialsModel.increment("failedAttempts",{where:{id:credentialsId}})   
            const {failedAttempts}=await this.getCredentialsById(credentialsId)   
            return failedAttempts     
        } catch (error) {
            throw error
        }
    }
    static async attemptsToOne(credentialsId:UUID){
        try {
            await CredentialsModel.update({failedAttempts:1},{where:{id:credentialsId}})
        } catch (error) {
            throw error
        }
    }
    static async attemptsToZero(credentialsId:UUID){
        try {
            await CredentialsModel.update({failedAttempts:0},{where:{id:credentialsId}})
        } catch (error) {
            throw error
        }
    }
    static async updateFailedAttempDate(credentialsId:UUID){
        try {
            await CredentialsModel.update({failedAttemptsDate:new Date()},{where:{id:credentialsId}})
        } catch (error) {
            throw error
        }
    }
    static async unprotect(credentialsId:UUID){
        try {
          await CredentialsModel.update({protected:false},{where:{credentialsId}})
        } catch (error) {
          throw error
        }
      }
      static async protect(credentialsId:UUID){
        try {
          await CredentialsModel.update({protected:true},{where:{credentialsId}})
        } catch (error) {
          throw error
        }
      }
      static async verify(credentialsId:UUID){
        try {
            await CredentialsModel.update({verified:true},{where:{id:credentialsId},returning:true})            
        } catch (error) {
            throw error
        }
      }
      static async updateAuhtCredentials(credentialsId:UUID,{mail,password}:authCredentialsInfo){
        try {
            await CredentialsModel.update({password,mail},{where:{id:credentialsId}})
        } catch (error) {
            throw error
        }
      }
}