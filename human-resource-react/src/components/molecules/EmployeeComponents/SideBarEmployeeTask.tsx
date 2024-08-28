import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel, GridToolbar,
} from "@mui/x-data-grid";
import {
    Autocomplete,
    Box,
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Grid, IconButton, LinearProgress,
    TextField, Typography

} from "@mui/material";
import { HumanResources, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {
    clearToken
} from "../../../store/feature/authSlice";
import Swal from "sweetalert2";

import {AddIcon, DeleteIcon} from "../../atoms/icons";
import { myErrorColour, myLightColour } from "../../../util/MyColours";
import {
    fetchAssignTaskToEmployee,
    fetchCancelSubTask,
    fetchCompleteTask,
    fetchDeleteSubTask,
    fetchFinishSubTask,
    fetchGetEmployeeTasks,
    fetchGetSubTasksOfSelectedTask,
    fetchGetTasks,

} from "../../../store/feature/TaskSlice";
import CircularProgress from "@mui/material/CircularProgress";
import {Clear} from "@mui/icons-material";






const SideBarTask = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');


    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const taskList = useAppSelector((state) => state.task.taskList);
    const [loading, setLoading] = useState(false);

    const [openAssignToEmployeeModal, setOpenAssignToEmployeeModal] = useState(false);
    const [openSubTaskModal, setOpenSubTaskModal] = useState(false);
    const employees = useAppSelector((state) => state.auth.userList);
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

    const subTasks = useAppSelector((state) => state.task.subTaskList);



    useEffect(() => {
        dispatch(
            fetchGetEmployeeTasks( {token: token, page: 0, pageSize: 100, searchText: searchText} )
        )
            .catch(() => {
                dispatch(clearToken());
            });
    }, [dispatch, searchText, token]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleCompleteTask = async () => {

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: myLightColour,
            cancelButtonColor: myErrorColour,
            confirmButtonText: "Yes, complete it!"
        });
        if (result.isConfirmed) {
            await dispatch(fetchCompleteTask({token: token, taskId: selectedRowIds[0]})).unwrap();
            await dispatch(
                fetchGetEmployeeTasks( {token: token, page: 0, pageSize: 100, searchText: searchText} )
            )
        }
    }

    const handleCloseAssignLeaveModal = () => {
        setOpenAssignToEmployeeModal(false);

    };

    const closeSubTaskModal = () => {
        setOpenSubTaskModal(false);
        dispatch(
            fetchGetEmployeeTasks( {token: token, page: 0, pageSize: 100, searchText: searchText} )
        )

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

    const handleCancelSubTaskClick = (id: number) => {

        dispatch(fetchCancelSubTask({token : token , subTaskId : id})).then(() => {
            dispatch (fetchGetSubTasksOfSelectedTask({token : token , taskId : selectedRowIds[0]}))
        })

    };

    const handleFinishClick = (id: number) => {

        dispatch(fetchFinishSubTask({token : token , subTaskId : id})).then(() => {
            dispatch (fetchGetSubTasksOfSelectedTask({token : token , taskId : selectedRowIds[0]}))
        })

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




    const columns: GridColDef[] = [
        { field: 'taskName', headerName: 'Task Name', flex: 1, headerAlign: "center" },
        { field: 'assignedEmployeeName', headerName: 'Assigned Employee Name', flex: 1, headerAlign: "center" },
        { field: 'assignedDate', headerName: 'Assigned Date', flex: 1, headerAlign: "center" },
        { field: 'completionDate', headerName: 'Completion Date', flex: 1, headerAlign: "center" },
        {
            field: 'subtasks',
            headerName: 'Sub Tasks',
            flex: 1,
            headerAlign: "center",
            renderCell: (params) => {
                console.log(params.row); // Satır verilerini kontrol edin
                const { numberOfCompletedSubtasks, numberOfSubTasks } = params.row;

                // numberOfSubTasks kontrolü
                if (numberOfSubTasks === undefined) {
                    return <Box>Data Missing</Box>;
                }

                return (
                    <Box width="100%">
                        <Box textAlign="center">{`${numberOfCompletedSubtasks}/${numberOfSubTasks}`}</Box>
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
                const { numberOfCompletedSubtasks, numberOfSubTasks, completionDate } = params.row;
                let completionPercentage = (numberOfCompletedSubtasks / numberOfSubTasks) * 100;
                if (numberOfSubTasks === 0) {
                    completionPercentage = 0;
                }
                if (completionDate !== null) {
                    completionPercentage = 100;
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
        { field: 'name', headerName: 'Task Name', flex: 1, headerAlign: "center" },
        { field: 'isCompleted', headerName: 'Completion', flex: 1, headerAlign: "center" },
        {
            field: 'delete',
            headerName: 'Edit',
            flex: 0.3,
            headerAlign: "center",
            renderCell: (params) => {
                const { isCompleted } = params.row;
                return (
                    <Box width="100%" display="flex" justifyContent="center">
                        {isCompleted ? (
                            <IconButton onClick={() => handleCancelSubTaskClick(params.id as number)}>
                                <Clear />
                            </IconButton>
                        ) : (
                            <IconButton onClick={() => handleFinishClick(params.id as number)}>
                                <CheckBoxIcon />
                            </IconButton>
                        )}
                    </Box>
                );
            },
        },
    ];


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
                    onClick={handleCompleteTask}
                    variant="contained"
                    color="success"
                    disabled={selectedRowIds.length === 0 || selectedRowIds.length > 1  || taskList.find(task => task.id === selectedRowIds[0])?.completionDate !== null}
                    startIcon={<AddIcon />}
                    sx={{ marginRight: '1%'}}
                >
                    Complete
                </Button>
                <Button
                    onClick={handleOpenSubTaskModal}
                    variant="contained"
                    color="secondary"
                    disabled={selectedRowIds.length === 0 || selectedRowIds.length > 1}
                    startIcon={<AddIcon />}
                    sx={{ marginRight: '1%' }}
                >
                    Check SubTasks
                </Button>
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
                            hideFooter={true}


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
                                height: '375px',
                                marginBottom:"50px"
                            }}
                        />


                    </Box>
                </DialogContent>
            </Dialog>



        </div>
    );
}


export default SideBarTask