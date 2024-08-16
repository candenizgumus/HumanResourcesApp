import React, {useEffect, useState} from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
} from "@mui/x-data-grid";
import {
    TextField

} from "@mui/material";
import {HumanResources, useAppSelector} from "../../../store";
import {useDispatch} from "react-redux";


import {
    clearToken
} from "../../../store/feature/authSlice";

import { fetchGetBonusesOfEmployee} from "../../../store/feature/bonusSlice";

const columns: GridColDef[] = [

    {field: "bonusAmount", headerName: "Bonus $", flex: 1, headerAlign: "center",
        renderCell: (params) => {
            // Check if the value is valid
            const value = params.value;
            if (typeof value === 'number' && !isNaN(value)) {
                // Format the number as currency
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(value);
            }
            return '$0.00'; // Return default value if not a valid number
        },
    },

    {field: "description", headerName: "Description", flex: 1, headerAlign: "center"},
    {field: "bonusDate", headerName: "Bonus Date", flex: 1, headerAlign: "center"},
    {field: "status", headerName: "Status", headerAlign: "center", flex: 1},


];


const  SideBarEmloyeeBonus = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');


    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const bonusList = useAppSelector((state) => state.bonus.bonusList);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);



    useEffect(() => {
        dispatch(
            fetchGetBonusesOfEmployee({
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



    return (
        <div style={{height: "auto", width: "inherit"}}>
            <TextField
                label="Description"
                variant="outlined"
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                style={{marginBottom: "10px"}}
            />
            <DataGrid
                rows={bonusList}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {page: 1, pageSize: 5},
                    },
                }}
                pageSizeOptions={[5, 10]}
                onRowSelectionModelChange={handleRowSelection}
                rowSelection={false}

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


export default SideBarEmloyeeBonus