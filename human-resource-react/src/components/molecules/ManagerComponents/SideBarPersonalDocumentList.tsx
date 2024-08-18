import React, { useState, useEffect } from 'react';
import { TextField, Grid, Button } from '@mui/material';
import { HumanResources, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";
import {
    fetchDeletePersonalDocument,
    fetchPersonalDocuments,
} from "../../../store/feature/personalDocumentSlice";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import DownloadButtonFromS3 from "../../atoms/DownloadButtonFromS3";
import Swal from "sweetalert2";
import { IPersonalDocument } from "../../../models/IPersonalDocument";
import { DeleteIcon } from '../../atoms/icons';
const columns: GridColDef[] = [
    { field: "email", headerName: "Email", flex: 1, headerAlign: "center" },
    { field: "description", headerName: "Description", flex: 3, headerAlign: "center" },
    { field: "documentType", headerName: "Document Type", flex: 1, headerAlign: "center" },
    {
        field: "attachedFile", headerName: "Document", headerAlign: "center", flex: 1,
        renderCell: (params) => (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%'
            }}>
                {params.value && <DownloadButtonFromS3 fileKey={params.value} />}
            </div>
        )
    },

];
const SideBarPersonalDocumentList: React.FC = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const token = useAppSelector((state) => state.auth.token);
    const employeeId = useAppSelector((state) => state.auth.selectedEmployeeId);
    const dispatch = useDispatch<HumanResources>();
    const [personalDocuments, setPersonelDocuments] = useState<IPersonalDocument[]>([]);    //const personalDocuments =  useAppSelector((state) => state.personalDocument.personalDocuments);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        dispatch(fetchPersonalDocuments({
            token: token,
            page: 0,
            searchText: searchText,
            pageSize: 100,
        })).then(data => {
            setPersonelDocuments(data.payload);
        })

    }, [dispatch, token, searchText]);


    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleDelete = () => {
        selectedRowIds.forEach((id) => {
            const selectedDocument = personalDocuments.find(doc => doc.id === id);
            if (selectedDocument) {
                const { attachedFile } = selectedDocument;

                dispatch(fetchDeletePersonalDocument({ id, token, attachedFile }))
                    .then(() => {
                        dispatch(fetchPersonalDocuments({
                            token: token,
                            page: 0,
                            searchText: searchText,
                            pageSize: 100,
                        })).then(data => {
                            if (data.payload.message) {
                                Swal.fire({
                                    icon: 'error',
                                    text: data.payload.message ?? 'Failed to delete document',
                                    showConfirmButton: true,
                                    confirmButtonColor: '#1976D2',
                                });
                            } else {
                                Swal.fire({
                                    icon: 'success',
                                    text: 'Document has been deleted',
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                            }
                            setPersonelDocuments(data.payload);
                        });
                    });
            }
        });
    };

    return (
        <div style={{ height: "auto", width: "inherit" }}>
            <TextField
                label="Search By Email"
                variant="outlined"
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                style={{ marginBottom: "1%", marginTop: "1%" }}
                fullWidth
                inputProps={{ maxLength: 50 }}
            />
            <DataGrid
                rows={personalDocuments}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
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
                    onClick={handleDelete}
                    variant="contained"
                    color="error"
                    disabled={selectedRowIds.length === 0}
                    startIcon={<DeleteIcon />}
                    sx={{ marginRight: '1%', width: '200px' }}
                >
                    Delete
                </Button>
            </Grid>
        </div>


    );
};

export default SideBarPersonalDocumentList;