export interface IUser{
    createdAt:Date ;
    updatedAt:Date ;
    status:string ;
    id:number ;
    companyId:number ;
    authId:number ;
    managerId:number ;
    salary:number ;
    email:string ;
    name:string ;
    surname:string ;
    phone:string ;
    birthDate:Date  ;
    hireDate:Date ;
    title:string;
    photo:string ;
    userType:string ;
    position:string ;
    sector:string ;
    location:string ;
    employeeTypeDefinitionId:number;
    subscriptionType:string;
    subscriptionStartDate:Date;
    subscriptionEndDate:Date;
    remainingAnnualLeave: number;
}