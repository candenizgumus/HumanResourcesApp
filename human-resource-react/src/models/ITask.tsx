
export interface ITask {
    id: number;
    employeeId: number;
    managerId: number;
    companyId: number;
    assignedDate: Date;
    completetionDate: Date;
    numberOfCompletedSubtasks: number;
    taskName: string;
    isCompleted: boolean;
    status: string;
}