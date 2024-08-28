import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import RestApis from "../../config/RestApis";
import {ITask} from "../../models/ITask";
import {ISubTask} from "../../models/ISubTask";

interface ITaskState{
    taskList:ITask[]
    subTaskList : ISubTask[]
}

const initialTaskState:ITaskState = {
    taskList: [],
    subTaskList : []
}


export interface IfetchSaveTask{
    taskName:string,
    token:string,
}

export const fetchSaveTask = createAsyncThunk(
    'task/fetchSaveTask',
    async (payload: IfetchSaveTask) => {

            const response = await fetch(RestApis.tasksService+`/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ` + payload.token
                },
                body: JSON.stringify({
                    'taskName': payload.taskName,
                })
            });
             
            return await response.json();
    }

)

export interface IfetchAssignTaskToEmployee{
    taskId:number,
    employeeId:number,
    token:string,
}

export const fetchAssignTaskToEmployee = createAsyncThunk(
    'task/fetchAssignTaskToEmployee',
    async (payload: IfetchAssignTaskToEmployee) => {

        const response = await fetch(RestApis.tasksService+`/assign-task-to-employee`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },
            body: JSON.stringify({
                'employeeId': payload.employeeId,
                'taskId': payload.taskId,
            })
        });

        return await response.json();
    }

)
interface IfetchGetTasks{
    token:string,
    page:number,
    pageSize:number,
    searchText:string
}
export const fetchGetTasks = createAsyncThunk(
    'task/fetchGetTasks',
    async (payload: IfetchGetTasks) => {

        const response = await fetch(RestApis.tasksService+`/get-all`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            },
            body: JSON.stringify({
                'page': payload.page,
                'pageSize': payload.pageSize,
                'searchText': payload.searchText
            })
        });

        return await response.json();
    }

)

interface IfetchGetSubTasksOfSelectedTask{
    token:string,
    taskId:number,
}
export const fetchGetSubTasksOfSelectedTask = createAsyncThunk(
    'task/fetchGetSubTasksOfSelectedTask',
    async (payload: IfetchGetSubTasksOfSelectedTask) => {

        const response = await fetch(RestApis.tasksService+`/get-all-subtasks-of-selected-task?taskId=`+payload.taskId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            }
        });

        return await response.json();
    }

)

interface IfetchDeleteBonus{
    token:string,
    id:number
}
export const fetchDeleteBonus = createAsyncThunk(
    'bonus/fetchGetBonusesOfManager',
    async (payload: IfetchDeleteBonus) => {

        const response = await fetch(RestApis.bonusService+`/delete?id=` + payload.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + payload.token
            }
        });

        return await response.json();
    }

)





const taskSlice = createSlice({
    name: 'task',
    initialState: initialTaskState,
    reducers: {},
    extraReducers: (build)=>{
        build.addCase(fetchGetTasks.fulfilled,(state,action)=>{
            state.taskList = action.payload
        })
        build.addCase(fetchGetSubTasksOfSelectedTask.fulfilled,(state,action)=>{
            state.subTaskList = action.payload
        })


    }
});

export default taskSlice.reducer;
export const {} = taskSlice.actions