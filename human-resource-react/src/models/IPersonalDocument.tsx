
export interface IPersonalDocument {
    id: number;
    employeeId: number;
    documentType: string;
    attachedFile:string;
    description: string;
    email: string;
    companyId: number;
    createdAt: Date;
    updatedAt: Date;
    status: string;

}