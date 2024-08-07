import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridPaginationModel,
    GridRowSelectionModel,
} from "@mui/x-data-grid";
import {

    TextField

} from "@mui/material";
import { HumanResources, useAppSelector } from "../../store";
import { useDispatch } from "react-redux";

import { IOfferList } from "../../models/IOfferList";
import {clearToken, fetchGetAllUsers, fetchGetUserCount} from "../../store/feature/authSlice";

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70, headerAlign: "center" },
    { field: "name", headerName: "First name", width: 120, headerAlign: "center" },
    { field: "surname", headerName: "Last name", width: 120, headerAlign: "center" },
    { field: "email", headerName: "Email", headerAlign: "center", width: 250 },
    { field: "phone", headerName: "Phone", sortable: false, headerAlign: "center", width: 140 },
   // { field: "companyName", headerName: "Company Name", width: 130, headerAlign: "center" },
    { field: "subscriptionType", headerName: "Sub. Type", width: 120, headerAlign: "center" },
    { field: "sector", headerName: "Sector", type: "string", width: 220, headerAlign: "center" },
    { field: "userType", headerName: "User Type", width: 120, headerAlign: "center" },
    { field: "subscriptionStartDate", headerName: "Sub. Start Date", type: "string", width: 150, headerAlign: "center" },
    { field: "subscriptionEndDate", headerName: "Sub. End Date", type: "string", width: 150, headerAlign: "center" },
    { field: "status", headerName: "Status", type: "string", width: 130, headerAlign: "center" },
];

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

export default function SideBarUsers() {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');


    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const userList = useAppSelector((state) => state.auth.userList);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 5,
    });
    const [rowCount, setRowCount] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await dispatch(fetchGetAllUsers({
                    token: token,
                    page: paginationModel.page,
                    pageSize: paginationModel.pageSize,
                    searchText: searchText,
                }));

                const count = await dispatch(fetchGetUserCount({
                    token: token,
                    searchText: searchText,
                }))
                setRowCount(count.payload)
            } catch {
                dispatch(clearToken());
            }
        };

        fetchData();
    }, [dispatch, searchText, token, paginationModel]);


    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handlePaginationModelChange = (model: GridPaginationModel) => {
        setPaginationModel(model);
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

                rowCount={rowCount}
                columns={columns}
                paginationMode="server"
                pagination
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationModelChange}

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
