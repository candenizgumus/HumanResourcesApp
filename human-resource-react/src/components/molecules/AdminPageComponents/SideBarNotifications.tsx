import { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
} from "@mui/x-data-grid";
import {
    Box,
    Button
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { HumanResources, useAppSelector } from "../../../store";
import { fetchDeleteNotification, fetchGetNotifications, fetchGetUnreadNotifications, fetchUpdateIsRead } from "../../../store/feature/notificationSlice";
import { changePageState, clearToken } from "../../../store/feature/authSlice";
import { GridFooterContainer, GridPagination } from "@mui/x-data-grid";



const columns: GridColDef[] = [
    { field: "notificationType", headerName: "Type", width: 150, headerAlign: "center" },
    { field: "notificationText", headerName: "Text", width: 1430, headerAlign: "center" },
];

export default function NotificationsPage() {
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const notificationAllList = useAppSelector((state) => state.notification.notificationAllList);
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);

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

    function CustomPagination(props: any) {
        return (
            <GridFooterContainer sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <GridPagination {...props} />
                <Button
                    onClick={handleDeleteClick}
                    variant="contained"
                    color="secondary"
                    disabled={selectedRowIds.length === 0}
                    startIcon={<DeleteIcon />}
                >
                    Delete {selectedRowIds.length} Notification{selectedRowIds.length > 1 ? "s" : ""}
                </Button>
            </GridFooterContainer>
        );
    }
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
                    pagination: CustomPagination,
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
                    // Hide footer elemets
                    "& .MuiDataGrid-footerContainer .MuiTablePagination-displayedRows": {
                        display: "none",
                    },
                    "& .MuiDataGrid-footerContainer .MuiTablePagination-selectLabel, & .MuiTablePagination-select": {
                        display: "none",
                    },
                    "& .MuiTablePagination-input": {
                        display: "none",
                    },
                    "& .MuiTablePagination-actions": {
                        display: "none",
                    },
                    "& .MuiDataGrid-selectedRowCount": {
                        display: "none"
                    }
                }}
            />
        </div>
    );
}
