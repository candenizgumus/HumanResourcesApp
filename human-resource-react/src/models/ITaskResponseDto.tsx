
export interface ITaskResponseDto {
    id: number;
   taskName : string;
   assignedEmployeeName : string;
   assignedDate : Date;
   completionDate : Date;
   numberOfCompletedSubtasks : number;
   numberOfSubTasks : number;
    status: string;
}