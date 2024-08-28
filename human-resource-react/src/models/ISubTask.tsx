import {ITask} from "./ITask";

export interface ISubTask {
    id: number;
    name: string;
    isCompleted: boolean;
    task: ITask;
    status: string;

}