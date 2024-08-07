import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
    GridPaginationModelApi,
    GridPaginationModel,
} from "@mui/x-data-grid";
import {
    Button,
    Grid,
    TextField,
    Modal,
    Box,
    Typography,
} from "@mui/material";
import { HumanResources, useAppSelector } from "../../store";
import { useDispatch } from "react-redux";
import { fetchGetCompanies, fetchGetCompanyCount, fetchUpdateCompany, ICompany } from "../../store/feature/companySlice";
import { clearToken } from "../../store/feature/authSlice";
import Swal from "sweetalert2";

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70, headerAlign: "center" },
    { field: "name", headerName: "Company Name", width: 160, headerAlign: "center" },
    { field: "logo", headerName: "Logo", width: 160, headerAlign: "center" },
    { field: "description", headerName: "Description", headerAlign: "center", width: 300 },
    { field: "numberOfEmployee", headerName: "Employee Count", headerAlign: "center", width: 150 },
    { field: "status", headerName: "Status", headerAlign: "center", width: 160 },
];

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

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

                const count = await dispatch(fetchGetCompanyCount(token))
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
        <div style={{ height: 400, width: "inherit" }}>
            <TextField
                label="Name"
                variant="outlined"
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                style={{ marginBottom: "10px" }}
            />
            <DataGrid
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
                }}
            />
            <Grid container spacing={1} style={{ marginTop: 16 }} direction="row">
                <Grid item>
                    <Button
                        onClick={handleEditClick}
                        variant="contained"
                        color="primary"
                        disabled={loading || selectedRowIds.length !== 1}
                    >
                        {loading ? "Processing..." : "Edit"}
                    </Button>
                </Grid>
            </Grid>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-title" variant="h6" component="h2">
                        Edit Company
                    </Typography>
                    {selectedCompany && (
                        <form >
                            <TextField sx={{ marginTop: "25px" }}
                                label="Company Name"
                                name="name"
                                variant="outlined"
                                value={selectedCompany.name}
                                onChange={handleInputChange}
                                fullWidth
                                style={{ marginBottom: "10px" }}
                            />
                            <TextField
                                label="Logo"
                                name="logo"
                                variant="outlined"
                                value={selectedCompany.logo}
                                onChange={handleInputChange}
                                fullWidth
                                style={{ marginBottom: "10px" }}
                            />
                            <TextField
                                label="Description"
                                name="description"
                                variant="outlined"
                                value={selectedCompany.description}
                                onChange={handleInputChange}
                                fullWidth
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
                            <Button
                                onClick={handleUpdateCompany}
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                fullWidth
                            >
                                {loading ? "Updating..." : "Update"}
                            </Button>
                        </form>
                    )}
                </Box>
            </Modal>
        </div>
    );
}
