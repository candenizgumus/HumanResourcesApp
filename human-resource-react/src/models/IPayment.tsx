export interface IPayment {
    id: number;
    payment:number;
    description: string;
    paymentDate: Date;
    companyId: number;
    status: string;
    createdAt: number;
    updatedAt: number
}