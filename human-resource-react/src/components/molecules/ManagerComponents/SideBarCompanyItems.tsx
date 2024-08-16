import React, {useState, useEffect} from 'react';
import {TextField, Grid, Button} from '@mui/material';
import {HumanResources, useAppSelector} from "../../../store";
import {useDispatch} from "react-redux";
import {
    fetchDeletePersonalDocument,
    fetchPersonalDocuments,
} from "../../../store/feature/personalDocumentSlice";
import {DataGrid, GridColDef, GridRowSelectionModel} from "@mui/x-data-grid";
import DownloadButtonFromS3 from "../../atoms/DownloadButtonFromS3";
import Swal from "sweetalert2";
import {IPersonalDocument} from "../../../models/IPersonalDocument";
import {fetchCompanyItems} from "../../../store/feature/companyItemSlice";
import {ICompanyItem} from "../../../models/ICompanyItem";
import {changePageState, setSelectedEmployeeId} from "../../../store/feature/authSlice";

const columns: GridColDef[] = [
    {field: "id", headerName: "Id", flex: 1, headerAlign: "center"},
    {field: "name", headerName: "Name", flex: 1, headerAlign: "center"},
    {field: "companyItemType", headerName: "Item Type", flex: 1, headerAlign: "center"},
    {field: "serialNumber", headerName: "Serial Number", flex: 1, headerAlign: "center"},
    {field: "status", headerName: "Status", flex: 1, headerAlign: "center"},
];

const SideBarCompanyItems: React.FC = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useDispatch<HumanResources>();
    const [searchText, setSearchText] = useState('');
    const [companyItems, setCompanyItems] = useState<ICompanyItem[]>([]);    //const personalDocuments =  useAppSelector((state) => state.personalDocument.personalDocuments);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        dispatch(fetchCompanyItems({
            token: token,
            page: 0,
            searchText: searchText,
            pageSize: 100,
        })).then(data => {
            setCompanyItems(data.payload);
        })

    }, [dispatch, token, searchText]);


    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleOnClickAddCompanyItem= () => {
        dispatch(changePageState("Add Item"))
    }

    return (
        <div style={{height: 400, width: "inherit"}}>
            <TextField
                label="Serial Number"
                variant="outlined"
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                style={{marginBottom: "10px"}}
            />
            <DataGrid
                rows={companyItems}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {page: 0, pageSize: 5},
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
            <Grid container spacing={1} style={{ marginTop: 16 }} direction="row">
                <Grid item>
                    <Button
                        onClick={handleOnClickAddCompanyItem}
                        variant="contained"
                        color="primary"
                    >
                        Add Item
                    </Button>
                </Grid>
            </Grid>
        </div>


    );
};

export default SideBarCompanyItems;