export interface IExpenditure{
    id: number
    employeeId: string
    description: string
    price: number
    approveDate:Date,
    isExpenditureApproved:boolean
    attachedFile:string


}