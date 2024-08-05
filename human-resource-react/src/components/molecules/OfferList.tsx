import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Button, Grid } from '@mui/material';
import { HumanResources, useAppSelector } from "../../store";
import { useDispatch } from "react-redux";
import {fetchApproveOffers, fetchGetOffers} from "../../store/feature/offerSlice";
import { useEffect, useState } from "react";
import { IOfferList } from "../../models/IOfferList";
import {clearToken} from "../../store/feature/authSlice";
import Swal from 'sweetalert2';
import TextField from "@mui/material/TextField";

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 , headerAlign: 'center', },
    { field: 'name', headerName: 'First name', width: 160 , headerAlign: 'center', },
    { field: 'surname', headerName: 'Last name', width: 160 , headerAlign: 'center',},
    {
        field: 'email',
        headerName: 'Email',
        headerAlign: 'center',
        width: 300,
    },
    {
        field: 'phone',
        headerName: 'Phone',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        headerAlign: 'center',
        width: 160,
    },
    {
        field: 'companyName',
        headerName: 'Company Name',
        width: 130,
        headerAlign: 'center',
    },
    {
        field: 'title',
        headerName: 'Title',
        width: 130,
        headerAlign: 'center',
    },
    {
        field: 'numberOfEmployee',
        headerName: 'Employee Count',
        type: 'number',
        width: 120,
        headerAlign: 'center',
    },
    {
        field: 'sector',
        headerName: 'Sector',
        type: 'string',
        width: 250,
        headerAlign: 'center',
    },
];

export default function OfferList() {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const offerList: IOfferList[] = useAppSelector(state => state.offer.offers);
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector(state => state.auth.token);
    const [searchText, setSearchText] = useState('');


    useEffect(() => {

        dispatch(fetchGetOffers({
            token: token,
            page: 0,
            pageSize: 50,
            email: searchText
        })).catch(() => {
            console.log('burası calisti')
            dispatch(clearToken());
    },)

    }, [dispatch, searchText, token]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleConfirmSelection = () => {

        selectedRowIds.forEach((id) => {
            dispatch(fetchApproveOffers({
                token: token,
                offerId: id
            })).then(() => {
                Swal.fire({
                    title: 'Success',
                    text: 'Offer has been approved',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            }).then(() => {

                dispatch(fetchGetOffers({
                    token: token,
                    page: 0,
                    pageSize: 50,
                    email: searchText
                })).catch(() => {


                    localStorage.removeItem('token');
                    dispatch(clearToken());

                })

            })
        })

    };

    return (
        <div style={{ height: 400, width: 'inherit' }}>
            <TextField
                label="Email"
                variant="outlined"
                onChange={event => setSearchText(event.target.value)}
                value={searchText}
                style={{ marginBottom: '10px' }}
            />
            <DataGrid

                rows={offerList}
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
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: 'rgba(224, 224, 224, 1)',
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                        textAlign: 'center',
                        fontWeight: 'bold',
                    },
                    '& .MuiDataGrid-cell': {
                        textAlign: 'center',
                    },
                }}

            />
            <Grid  container spacing={2} style={{ marginTop: 16 }}>
                <Grid  item xs={12}>
                    <Button
                        onClick={handleConfirmSelection}
                        variant="contained"
                        color="primary"

                    >
                        Confirm Selection
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}
