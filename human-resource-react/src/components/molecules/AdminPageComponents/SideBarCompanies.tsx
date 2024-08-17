import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
    GridPaginationModel,
    GridToolbar
} from "@mui/x-data-grid";
import CircularProgress from '@mui/material/CircularProgress';
import {
    Button,
    Grid,
    TextField,
    Modal,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography, Avatar,
} from "@mui/material";
import { HumanResources, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";
import { fetchGetCompanies, fetchGetCompanyCount, fetchUpdateCompany } from "../../../store/feature/companySlice";
import { clearToken } from "../../../store/feature/authSlice";
import Swal from "sweetalert2";
import { ICompany } from "../../../models/ICompany";
import {EditIcon} from "../../atoms/icons"

const columns: GridColDef[] = [
    { field: "name", headerName: "Company Name", flex: 1, headerAlign: "center" },
    { field: "description", headerName: "Description", headerAlign: "center", flex: 3 },
    { field: "numberOfEmployee", headerName: "Employee Count", headerAlign: "center", flex: 1 },
    { field: "status", headerName: "Status", headerAlign: "center", flex: 1 },
    {
        field: "logo",
        headerName: "Logo",
        flex: 1,
        headerAlign: "center",
        sortable: false,
        renderCell: (params) => (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                }}
            >
                <Avatar
                    alt={params.row.name}
                    src={params.value}
                    style={{
                        width: 40,
                        height: 40,
                    }}
                    imgProps={{
                        style: {
                            objectFit: 'contain', // Ensures the image fits within the Avatar
                        },
                    }}
                />
            </div>
        ),
    },
];

export default function OfferList() {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<ICompany | null>(null);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 5,
    });
    const companyList: ICompany[] = useAppSelector((state) => state.company.companyList);
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const [rowCount, setRowCount] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await dispatch(fetchGetCompanies({
                    token: token,
                    page: paginationModel.page,
                    pageSize: paginationModel.pageSize,
                    searchText: searchText,
                }));

                const count = await dispatch(fetchGetCompanyCount({
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

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleEditClick = () => {
        if (selectedRowIds.length === 1) {
            const companyToEdit = companyList.find(
                (company) => company.id === selectedRowIds[0]
            );
            setSelectedCompany(companyToEdit || null);
            handleOpen();
        } else {
            Swal.fire("Please select exactly one company to edit.");
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedCompany) {
            setSelectedCompany({
                ...selectedCompany,
                [event.target.name]: event.target.value,
            });
        }
    };

    const handleUpdateCompany = async () => {
        if (selectedCompany) {
            setLoading(true);
            try {
                await dispatch(fetchUpdateCompany({
                    token: token,
                    id: selectedCompany.id,
                    name: selectedCompany.name,
                    logo: selectedCompany.logo,
                    description: selectedCompany.description,
                    numberOfEmployee: selectedCompany.numberOfEmployee,
                }));
                Swal.fire("Success", "Company updated successfully", "success");
                // Fetch updated companies
                await dispatch(fetchGetCompanies({
                    token: token,
                    page: paginationModel.page,
                    pageSize: paginationModel.pageSize,
                    searchText: searchText,
                }));
            } catch (error) {
                console.error("Error updating company:", error);
            } finally {
                setLoading(false);
                handleClose();
            }
        }
    };

    const handlePaginationModelChange = (model: GridPaginationModel) => {
        setPaginationModel(model);
    };

    return (
        <div style={{ height: 'auto', width: "inherit" }}>
            <TextField
                label="Search By Name"
                variant="outlined"
                fullWidth
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                style={{ marginBottom: "1%", marginTop: "1%" }}
            />
            <DataGrid
                slots={{
                    toolbar: GridToolbar,
                }}
                rows={companyList}
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
                    height: '407px'
                }}
            />
            <Grid sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '2%', marginBottom: '2%' }}>
                <Button
                    onClick={handleEditClick}
                    variant="contained"
                    color="secondary"
                    startIcon={<EditIcon />}
                    disabled={loading || selectedRowIds.length !== 1}
                    sx={{ marginRight: '1%', width: '200px' }}
                >
                    Edit
                </Button>
            </Grid>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
                <DialogTitle>Edit Company</DialogTitle>
                <DialogContent>
                    <Box mt={2}>
                        {selectedCompany && (
                            <>
                                <Grid item mt={2}>
                                    <TextField sx={{ marginTop: "25px" }}
                                        label="Company Name"
                                        name="name"
                                        variant="outlined"
                                        value={selectedCompany.name}
                                        onChange={handleInputChange}
                                        fullWidth
                                        inputProps={{ maxLength: 64 }}
                                        style={{ marginBottom: "10px" }}
                                    />
                                    <TextField
                                        label="Logo"
                                        name="logo"
                                        variant="outlined"
                                        value={selectedCompany.logo}
                                        onChange={handleInputChange}
                                        fullWidth
                                        inputProps={{ maxLength: 64 }}
                                        style={{ marginBottom: "10px" }}
                                    />
                                    <TextField
                                        label="Description"
                                        name="description"
                                        variant="outlined"
                                        value={selectedCompany.description}
                                        onChange={handleInputChange}
                                        fullWidth
                                        inputProps={{ maxLength: 255 }}
                                        style={{ marginBottom: "10px" }}
                                    />
                                    <TextField
                                        label="Employee Count"
                                        name="numberOfEmployee"
                                        variant="outlined"
                                        value={selectedCompany.numberOfEmployee}
                                        onChange={handleInputChange}
                                        fullWidth
                                        style={{ marginBottom: "35px" }}
                                    />
                                </Grid>
                            </>
                        )}
                    </Box>
                    {loading && (
                        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                            <CircularProgress />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose} color="error" sx={{ marginRight: '17px', width: '100px' }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleUpdateCompany} color="primary" sx={{ marginRight: '17px', width: '100px' }}>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
