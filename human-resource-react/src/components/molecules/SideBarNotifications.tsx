import { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
    GridToolbar,
} from "@mui/x-data-grid";
import {
    Grid,
    Button,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AssistantPhotoIcon from '@mui/icons-material/AssistantPhoto';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { HumanResources, useAppSelector } from "../../store";
import { fetchDeleteNotification, fetchGetNotifications, fetchGetUnreadNotifications, fetchUpdateIsRead } from "../../store/feature/notificationSlice";
import { changePageState, clearToken } from "../../store/feature/authSlice";

const renderNotificationType = (params: any) => {
    switch (params.value) {
        case 'INFORMATION':
            return <InfoIcon style={{ color: '#2196F3' }} />;
        case 'WARNING':
            return <WarningIcon style={{ color: '#FF9800' }} />;
        case 'ERROR':
            return <ErrorIcon style={{ color: '#F44336' }} />;
        case 'SUCCESS':
            return <CheckCircleIcon style={{ color: '#4CAF50' }} />;
        case 'ASSIST':
            return <AssistantPhotoIcon style={{ color: '#673AB7' }} />;
        default:
            return null;
    }
};

const columns: GridColDef[] = [
    {
        field: "notificationType",
        headerName: "Type",
        width: 150,
        headerAlign: "center",
        renderCell: renderNotificationType,
    },
    {
        field: "notificationText",
        headerName: "Text",
        width: 1430,
        headerAlign: "center"
    },
];

export default function NotificationsPage() {
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const notificationAllList = useAppSelector((state) => state.notification.notificationAllList);
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [allSelectedRead, setAllSelectedRead] = useState<boolean>(true); // State to track if all selected notifications are read

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(fetchGetNotifications({
                    token: token,
                    page: 0,
                    pageSize: 100,
                    searchText: "",
                }));
            } catch {
                dispatch(clearToken());
            }
        };

        fetchData();
    }, [dispatch, token]);

    const handleRowClick = (params: any) => {
        if (params.row.url) {
            dispatch(changePageState(params.row.url));
            dispatch(fetchUpdateIsRead({
                token,
                id: params.row.id,
                isRead: true
            })).then(() => {
                dispatch(fetchGetNotifications({
                    token: token,
                    page: 0,
                    pageSize: 100,
                    searchText: "",
                })).then(() => {
                    dispatch(fetchGetUnreadNotifications(token));
                })
            })
        }
    };

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
        
        // Check if all selected notifications are already read
        const allRead = newSelectionModel.every((id) => {
            const notification = notificationAllList.find((notif) => notif.id === id);
            return notification?.isRead === true;
        });

        setAllSelectedRead(allRead);
    };

    const handleDeleteClick = async () => {
        if (selectedRowIds.length > 0) {
            try {
                for (const id of selectedRowIds) {
                    await dispatch(fetchDeleteNotification({
                        token: token,
                        id: id,
                    }));
                }
                Swal.fire("Success", "Notifications deleted successfully", "success");
                dispatch(fetchGetUnreadNotifications(token));

                await dispatch(fetchGetNotifications({
                    token: token,
                    page: 0,
                    pageSize: 100,
                    searchText: "",
                }));
            } catch (error) {
                console.error("Error deleting notifications:", error);
                Swal.fire("Error", "There was a problem deleting the notifications.", "error");
            }
        } else {
            Swal.fire("Please select at least one notification to delete.");
        }
    };

    const handleMarkAsReadClick = async () => {
        if (selectedRowIds.length > 0) {
            try {
                let successfulUpdates = 0; // Counter for successfully marked as read notifications
                for (const id of selectedRowIds) {
                    const notification = notificationAllList.find((notif) => notif.id === id);
    
                    if (notification && !notification.isRead) {
                        const result = await dispatch(fetchUpdateIsRead({
                            token,
                            id: id,
                            isRead: true
                        }));
                        if (result.meta.requestStatus === 'fulfilled') {
                            successfulUpdates++; // Increment if the update was successful
                        }
                    }
                }
    
                Swal.fire(
                    "Success",
                    `${successfulUpdates} notification${successfulUpdates !== 1 ? 's' : ''} marked as read.`,
                    "success"
                );
    
                // Refresh notifications
                await dispatch(fetchGetUnreadNotifications(token));
                await dispatch(fetchGetNotifications({
                    token: token,
                    page: 0,
                    pageSize: 100,
                    searchText: "",
                }));
            } catch (error) {
                console.error("Error marking notifications as read:", error);
                Swal.fire("Error", "There was a problem marking the notifications as read.", "error");
            }
        } else {
            Swal.fire("Please select at least one notification to mark as read.");
        }
    };
    
    return (
        <div style={{ height: '80vh', width: "inherit" }}>
            <DataGrid
                paginationMode="server"
                rows={notificationAllList}
                columns={columns}
                checkboxSelection
                onRowSelectionModelChange={handleRowSelection}
                onRowClick={handleRowClick}
                slots={{
                    toolbar: GridToolbar,
                }}
                getRowClassName={(params) =>
                    params.row.isRead === false ? 'MuiDataGrid-row--highlighted' : ''
                }
                sx={{
                    "& .MuiDataGrid-columnHeaderTitle": {
                        textAlign: "center",
                        fontWeight: "bold",
                    },
                    "& .MuiDataGrid-cell": {
                        textAlign: "center",
                    },
                    "& .MuiDataGrid-row--highlighted": {
                        backgroundColor: "#C8E6C9", // Pale green Highlight for unread notifications
                    },
                    // Hide footer elements
                    "& .MuiDataGrid-footerContainer .MuiTablePagination-displayedRows": {
                        display: "none",
                    },
                    "& .MuiTablePagination-input": {
                        display: "none",
                    },
                    "& .MuiTablePagination-actions": {
                        display: "none",
                    },
                    "& .MuiToolbar-regular": {
                        display: "none"
                    }
                }}
            />
            <Grid sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '1%' }}>
                <Button
                    onClick={handleDeleteClick}
                    variant="contained"
                    color="error"
                    disabled={selectedRowIds.length === 0}
                    startIcon={<DeleteIcon />}
                    sx={{ marginRight: '1%' }}
                >
                    Delete
                </Button>
                <Button
                    onClick={handleMarkAsReadClick}
                    variant="contained"
                    color="secondary"
                    disabled={selectedRowIds.length === 0 || allSelectedRead} // Disable if all selected are read
                    startIcon={<CheckCircleIcon />}
                >
                    Mark as Read
                </Button>
            </Grid>
        </div>
    );
}
