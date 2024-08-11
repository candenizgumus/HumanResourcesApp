export interface IExpenditure{
    id: number
    employeeId: number
    companyId: number
    description: string
    price: number
    approveDate:Date,
    isExpenditureApproved:boolean
    attachedFile:string


}