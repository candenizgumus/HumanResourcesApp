export interface IExpenditure {
    createdAt: Date;
    updatedAt: Date;
    status: string;
    id: number
    employeeId: number
    companyId: number
    description: string
    price: number
    approveDate: Date,
    isExpenditureApproved: boolean,
    attachedFile: File | null

}