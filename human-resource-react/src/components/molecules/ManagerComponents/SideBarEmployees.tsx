import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
} from "@mui/x-data-grid";
import {

    TextField

} from "@mui/material";
import { HumanResources, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";


import {clearToken, fetchGetAllUsers, fetchGetAllUsersOfManager} from "../../../store/feature/authSlice";

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70, headerAlign: "center" },
    { field: "name", headerName: "First name", width: 120, headerAlign: "center" },
    { field: "surname", headerName: "Last name", width: 120, headerAlign: "center" },
    { field: "email", headerName: "Email", headerAlign: "center", width: 250 },
    { field: "phone", headerName: "Phone", sortable: false, headerAlign: "center", width: 140 },
    { field: "position", headerName: "Position", type: "string", width: 220, headerAlign: "center" },
    { field: "userType", headerName: "User Type", width: 150, headerAlign: "center" },
    { field: "employeeType", headerName: "Employee Type", width: 150, headerAlign: "center" },
    { field: "status", headerName: "Status", width: 120, headerAlign: "center" },

];


export default function SideBarEmployees() {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');


    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const userList = useAppSelector((state) => state.auth.userList);


    useEffect(() => {
        dispatch(
            fetchGetAllUsersOfManager({
                token: token,
                page: 0,
                pageSize: 100,
                searchText: searchText,
            })
        )
            .catch(() => {
            dispatch(clearToken());
        });
    }, [dispatch, searchText, token]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    return (
        <div style={{ height: 400, width: "inherit" }}>
            <TextField
                label="Email"
                variant="outlined"
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                style={{ marginBottom: "10px" }}
            />
            <DataGrid
                rows={userList}
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
                }}
            />



        </div>
    );
}
