import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel, GridToolbar,
} from "@mui/x-data-grid";
import {
    Button, FormControl,
    Grid, InputLabel, MenuItem, Select,
    TextField

} from "@mui/material";
import { HumanResources, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";


import {
    clearToken
} from "../../../store/feature/authSlice";
import {
    fetchFindAllDistinctUsernames,
    fetchGetAllTimeDatasByUsernameAndSlideId,
    fetchGetUsernamesSlides
} from "../../../store/feature/timeDataSlice";


const columns: GridColDef[] = [

    { field: "userName", headerName: "Username", flex: 1, headerAlign: "center" },
    { field: "slideId", headerName: "Slide Id", flex: 1, headerAlign: "center" },
    { field: "visitCount", headerName: "Visit Count", flex: 1, headerAlign: "center" },
    { field: "pageNumber", headerName: "Page Number", flex: 2, headerAlign: "center"
    ,

        renderCell: (params) => (
            <div>{(Number((params.value)) +1)}</div> //To fix page number from data
        ),
    },
    {
        field: "timeSpent",
        headerName: "Time Spent",
        flex: 2,
        headerAlign: "center",
        renderCell: (params) => (
            <div>{(params.value).toFixed(2)} sec</div>
        ),
    },
    { field: "userIp", headerName: "Ip", flex: 2, headerAlign: "center" },
    { field: "createdAt", headerName: "Created At", flex: 2, headerAlign: "center" },

];


const SideBarSlideDatas = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');
    const [userNames, setUserNames] = useState<string[]>([]);
    const [selectedUsername, setSelectedUsername] = useState('');
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [slideIds, setSlideIds] = useState<number[]>([]);
    const [selectedSlideId, setSelectedSlideId] = useState('')
    const timeDatas = useAppSelector((state) => state.timeData.timeDatas);

    useEffect(() => {
        dispatch(fetchFindAllDistinctUsernames(token)).then(data => {
        setUserNames(data.payload)
        })
            .catch(() => {
                dispatch(clearToken());
            });
    }, [dispatch, searchText, token, loading, isActivating]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    useEffect(() => {
        dispatch(fetchGetUsernamesSlides({token, userName: selectedUsername})).then(data => {
            setSlideIds(data.payload)
        })
        setSelectedSlideId('')
    }, [selectedUsername]);

    useEffect(() => {
        if (selectedSlideId) {
            dispatch(fetchGetAllTimeDatasByUsernameAndSlideId({token, userName: selectedUsername, slideId: selectedSlideId}))
        }

    }, [selectedSlideId]);

    return (
        <div style={{ height: "auto", width: "inherit" }}>
            <DataGrid
                slots={{
                    toolbar: GridToolbar,
                }}
                rows={timeDatas}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 1, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[10, 10]}

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
                    height: '668px',
                    mt: 3
                }}
            />

<Grid container spacing={2}>
    <Grid item xs={12} sm={12} md={12} lg={6} sx={{ mt: 3 }}>
        <FormControl variant="outlined" fullWidth={true}>
            <InputLabel>{'Please Select Username'}</InputLabel>
            <Select
                value={selectedUsername}
                onChange={event => setSelectedUsername(event.target.value as string)}
                label="Usernames"
            >
                {Object.values(userNames).length === 0 ? (
                    <MenuItem disabled>
                        {'No usernames available'}
                    </MenuItem>
                ) : (
                    Object.values(userNames).map(name => (
                        <MenuItem key={name} value={name}>
                            {name}
                        </MenuItem>
                    ))
                )}
            </Select>
        </FormControl>
    </Grid>
    <Grid item xs={12} sm={12} md={12} lg={6} sx={{ mt: 3 }}>
        <FormControl disabled={selectedUsername === ''} variant="outlined" fullWidth={true}>
            <InputLabel>{'Please Select Slide Id'}</InputLabel>
            <Select
                value={selectedSlideId}
                onChange={event => setSelectedSlideId(event.target.value)}
                label="Slide Ids"
            >
                {Object.values(slideIds).length === 0 ? (
                    <MenuItem disabled>
                        {'No slide IDs available'}
                    </MenuItem>
                ) : (
                    Object.values(slideIds).map(id => (
                        <MenuItem key={id} value={id}>
                            {id}
                        </MenuItem>
                    ))
                )}
            </Select>
        </FormControl>
    </Grid>
</Grid>

        </div>
    );

}


export default SideBarSlideDatas