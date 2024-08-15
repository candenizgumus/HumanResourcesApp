import { IUserType } from "./IUserType";

export interface ICreateUser{
    email:string ,
    password: string,
    userType: IUserType,
    token: string,
}