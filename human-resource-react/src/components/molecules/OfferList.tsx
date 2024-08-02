import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Button, Grid } from '@mui/material';
import { HumanResources, useAppSelector } from "../../store";
import { useDispatch } from "react-redux";
import { fetchGetOffers } from "../../store/feature/offerSlice";
import { useEffect, useState } from "react";
import { IOfferList } from "../../models/IOfferList";
import {clearToken} from "../../store/feature/authSlice";

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'First name', width: 160 },
    { field: 'surname', headerName: 'Last name', width: 160 },
    {
        field: 'email',
        headerName: 'Email',
        width: 300,
    },
    {
        field: 'phone',
        headerName: 'Phone',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
    },
    {
        field: 'companyName',
        headerName: 'Company Name',
        width: 130,
    },
    {
        field: 'title',
        headerName: 'Title',
        width: 130,
    },
    {
        field: 'numberOfEmployee',
        headerName: 'Employee Count',
        type: 'number',
        width: 120,
    },
];

export default function OfferList() {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const offerList: IOfferList[] = useAppSelector(state => state.offer.offers);
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector(state => state.auth.token);

    useEffect(() => {

        dispatch(fetchGetOffers({
            token: token,
            page: 0,
            pageSize: 10
        })).catch(() => {

                console.log('burası calisti')
                localStorage.removeItem('token');
                dispatch(clearToken());

        })

    }, []);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleConfirmSelection = () => {
        // Burada seçilen ID'lerle yapılacak işlemleri belirleyebilirsiniz
        console.log('Selected Row IDs:', selectedRowIds);
        // Örneğin, bu ID'lerle bir API çağrısı yapabilirsiniz.
    };

    return (
        <div style={{ height: 400, width: 'inherit' }}>
            <DataGrid
                rows={offerList}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 1, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[10, 10]}
                checkboxSelection
                onRowSelectionModelChange={handleRowSelection}


            />
            <Grid container spacing={2} style={{ marginTop: 16 }}>
                <Grid item xs={12}>
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
