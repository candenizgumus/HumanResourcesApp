import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel, GridToolbar,
} from "@mui/x-data-grid";
import {
    Autocomplete,
    Box,
    Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl,
    Grid, InputAdornment, InputLabel, LinearProgress, OutlinedInput,
    TextField, Typography

} from "@mui/material";
import { HumanResources, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";


import {
    clearToken
} from "../../../store/feature/authSlice";
import Swal from "sweetalert2";

import {AddIcon, DeleteIcon} from "../../atoms/icons";
import { myErrorColour, myLightColour } from "../../../util/MyColours";
import {
    fetchAssignTaskToEmployee,
    fetchGetSubTasksOfSelectedTask,
    fetchGetTasks,
    fetchSaveTask
} from "../../../store/feature/TaskSlice";
import CircularProgress from "@mui/material/CircularProgress";




const columns: GridColDef[] = [
    { field: 'taskName', headerName: 'Task Name', flex: 1 , headerAlign: "center" },
    { field: 'assignedEmployeeName', headerName: 'Assigned Employee Name', flex: 1 , headerAlign: "center" },
    { field: 'assignedDate', headerName: 'Assigned Date', flex: 1 , headerAlign: "center" },
    { field: 'completionDate', headerName: 'Completion Date', flex: 1 , headerAlign: "center" },
    { field: 'numberOfCompletedSubtasks', headerName: 'Sub Tasks', flex: 1 , headerAlign: "center" ,
        renderCell: (params) => {
            const { numberOfCompletedSubtasks, subtasks } = params.row;

            return (
                <Box width="100%">
                    <Box textAlign="center">{`${numberOfCompletedSubtasks}/${subtasks.length}`}</Box>
                </Box>
            );
        },

    },
    {
        field: 'completion',
        headerName: 'Completion',
        flex: 1,
        headerAlign: "center",
        renderCell: (params) => {
            const { numberOfCompletedSubtasks, subtasks } = params.row;
            let completionPercentage = (numberOfCompletedSubtasks / subtasks.length) * 100;
            if (subtasks.length === 0) {
                completionPercentage =  0;
            }
            return (
                <Box width="100%">
                    <LinearProgress variant="determinate" value={completionPercentage} />
                    <Box textAlign="center">{`${Math.round(completionPercentage)}%`}</Box>
                </Box>
            );
        },
    },
];

const columnSubTasks: GridColDef[] = [
    { field: 'name', headerName: 'Task Name', flex: 1 , headerAlign: "center" },
    { field: 'isCompleted', headerName: 'Completion', flex: 1 , headerAlign: "center" },
];

const SideBarTask = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');


    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const taskList = useAppSelector((state) => state.task.taskList);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [taskName, setTaskName] = useState('');

    const [openAssignToEmployeeModal, setOpenAssignToEmployeeModal] = useState(false);
    const [openSubTaskModal, setOpenSubTaskModal] = useState(false);
    const employees = useAppSelector((state) => state.auth.userList);
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

    const subTasks = useAppSelector((state) => state.task.subTaskList);



    useEffect(() => {
        dispatch(
            fetchGetTasks({
                token: token,
                page: 0,
                pageSize: 100,
                searchText: searchText,
            })
        )
            .catch(() => {
                dispatch(clearToken());
            });
    }, [dispatch, searchText, token, loading, isActivating]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleAssignToEmployee = async () => {
        setOpenAssignToEmployeeModal(true)
    }

    const handleCloseAssignLeaveModal = () => {
        setOpenAssignToEmployeeModal(false);

    };

    const closeSubTaskModal = () => {
        setOpenSubTaskModal(false);

    };
    const handleOpenSubTaskModal = () => {

        setOpenSubTaskModal(true)
        dispatch(fetchGetSubTasksOfSelectedTask({token : token , taskId : selectedRowIds[0]}))
    }

    const handleEmployeeChange = (event: any, selectedEmployee: any) => {
        if (selectedEmployee) {
            setSelectedEmployee(selectedEmployee);

        } else {
            setSelectedEmployee(null);
        }
    };



    const handleAssignEmployee = async () => {
        dispatch(fetchAssignTaskToEmployee({token : token , taskId : selectedRowIds[0] , employeeId : selectedEmployee.id})).unwrap();
        Swal.fire({
            title: "Saved!",
            text: "Your assignment has been saved.",
            icon: "success",
            confirmButtonColor: myLightColour,
            cancelButtonColor: myErrorColour,
        }).then(() => {
            dispatch(
                fetchGetTasks({
                    token: token,
                    page: 0,
                    pageSize: 100,
                    searchText: searchText,
                })
            );

        })

        setOpenAssignToEmployeeModal(false)

    }
    const handleSaveTask = async () => {
        await dispatch(fetchSaveTask({token : token , taskName : taskName})).unwrap();
        Swal.fire({
            title: "Saved!",
            text: "Your task has been saved.",
            icon: "success",
            confirmButtonColor: myLightColour,
            cancelButtonColor: myErrorColour,
        }).then(() => {
            dispatch(
                fetchGetTasks({
                    token: token,
                    page: 0,
                    pageSize: 100,
                    searchText: searchText,
                })
            );

        })
            .then(() => setTaskName(''))
    }


    // const handleDelete = async () => {
    //     for (let id of selectedRowIds) {
    //         const selectedBonus = bonusList.find(
    //             (selectedBonus) => selectedBonus.id === id
    //         );
    //         if (!selectedBonus) continue;
    //
    //
    //         setLoading(true);
    //         try {
    //             const result = await Swal.fire({
    //                 title: "Are you sure?",
    //                 text: "You won't be able to revert this!",
    //                 icon: "warning",
    //                 showCancelButton: true,
    //                 confirmButtonColor: myLightColour,
    //                 cancelButtonColor: myErrorColour,
    //                 confirmButtonText: "Yes, delete it!"
    //             });
    //
    //             if (result.isConfirmed) {
    //                 const data = await dispatch(fetchDeleteBonus({
    //                     token: token,
    //                     id: selectedBonus.id,
    //                 }));
    //
    //                 if (data.payload.message) {
    //                     await Swal.fire({
    //                         title: "Error",
    //                         text: data.payload.message,
    //                         icon: "error",
    //                         confirmButtonText: "OK",
    //                         confirmButtonColor: myLightColour,
    //                         cancelButtonColor: myErrorColour,
    //                     });
    //                     return;
    //                 } else {
    //                     Swal.fire({
    //                         title: "Deleted!",
    //                         text: "Your bonus has been deleted.",
    //                         icon: "success",
    //                         confirmButtonColor: myLightColour,
    //                         cancelButtonColor: myErrorColour,
    //                     }).then(() => {
    //                         dispatch(
    //                             fetchGetBonusesOfManager({
    //                                 token: token,
    //                                 page: 0,
    //                                 pageSize: 100,
    //                                 searchText: searchText,
    //                             })
    //                         );
    //
    //                     })
    //
    //                 }
    //             }
    //         } catch (error) {
    //             localStorage.removeItem("token");
    //             dispatch(clearToken());
    //         }
    //     }
    //     setLoading(false);
    // };

    return (
        <div style={{ height: "auto", width: "inherit" }}>
            <TextField
                label="Search By Task Name"
                variant="outlined"
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                style={{ marginBottom: "1%", marginTop: "1%" }}
                fullWidth
                inputProps={{ maxLength: 50 }}
            />
            <DataGrid
                slots={{
                    toolbar: GridToolbar,
                }}
                rows={taskList}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 1, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                onRowSelectionModelChange={handleRowSelection}
                sx={{
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "rgba(224, 224, 224, 1)",
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                        textAlign: "center",
                        fontWeight: "bold",
                    },
                    "& .MuiDataGrid-cell": {
                        textAlign: "center",
                    },
                    height: '407px'
                }}
            />
            <Grid sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '2%', marginBottom: '2%' }}>
               <Button
                    onClick={handleAssignToEmployee}
                    variant="contained"
                    color="success"
                    disabled={selectedRowIds.length === 0 || selectedRowIds.length > 1 }
                    startIcon={<AddIcon />}
                    sx={{ marginRight: '1%'}}
                >
                    Assign To Employee
                </Button>
                <Button
                    onClick={handleOpenSubTaskModal}
                    variant="contained"
                    color="secondary"
                    disabled={selectedRowIds.length === 0 || selectedRowIds.length > 1}
                    startIcon={<AddIcon />}
                    sx={{ marginRight: '1%' }}
                >
                    Add/Check SubTasks
                </Button>
            </Grid>

            <Grid container spacing={2}  direction="row">
                <Grid item xs={12}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Add Task
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Task Name"
                        name="taskName"
                        value={taskName}
                        onChange={e => setTaskName(e.target.value)}
                        fullWidth
                        required
                        inputProps={{ maxLength: 100 }}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button
                        onClick={handleSaveTask}
                        variant="contained"
                        color="success"
                        disabled={taskName.length === 0 }
                        startIcon={<AddIcon />}
                        sx={{ marginRight: '1%', width: '200px' }}
                    >
                        Add
                    </Button>
                </Grid>
            </Grid>




            <Dialog open={openAssignToEmployeeModal} onClose={handleCloseAssignLeaveModal} fullWidth maxWidth='sm'>
                <DialogTitle>Assign Leave</DialogTitle>
                <DialogContent>
                    <Box mt={2}>
                        <Autocomplete
                            options={employees}
                            getOptionLabel={(option) => option.name + " " + option.surname}
                            onChange={handleEmployeeChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Employee"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />


                    </Box>
                    {loading && (
                        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                            <CircularProgress/>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAssignLeaveModal} color="error" variant="contained"
                            sx={{marginRight: '17px', width: '100px'}}>
                        Cancel
                    </Button>
                    <Button onClick={handleAssignEmployee} color="success" variant="contained"
                            sx={{marginRight: '17px', width: '100px'}}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openSubTaskModal} onClose={closeSubTaskModal} fullWidth maxWidth='sm'>
                <DialogTitle>Sub Tasks</DialogTitle>
                <DialogContent>
                    <Box mt={2}>
                        <DataGrid
                            rows={subTasks}
                            columns={columnSubTasks}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 1, pageSize: 5 },
                                },
                            }}
                            hideFooter={true}
                            pageSizeOptions={[5, 10]}
                            checkboxSelection
                            onRowSelectionModelChange={handleRowSelection}
                            sx={{
                                "& .MuiDataGrid-columnHeaders": {
                                    backgroundColor: "rgba(224, 224, 224, 1)",
                                },
                                "& .MuiDataGrid-columnHeaderTitle": {
                                    textAlign: "center",
                                    fontWeight: "bold",
                                },
                                "& .MuiDataGrid-cell": {
                                    textAlign: "center",
                                },
                                height: '407px',
                                marginBottom:"50px"
                            }}
                        />


                    </Box>
                </DialogContent>
                <DialogActions>

                        <TextField
                            label="SubTask"
                            name="subTask"
                            value={taskName}
                            onChange={e => setTaskName(e.target.value)}
                            fullWidth
                            required
                            inputProps={{ maxLength: 100 }}
                        />

                    <Button onClick={handleAssignEmployee} color="success" variant="contained"
                            sx={{marginRight: '17px', width: '100px'}}>
                        Add SubTask
                    </Button>
                </DialogActions>
            </Dialog>



        </div>
    );
}


export default SideBarTask