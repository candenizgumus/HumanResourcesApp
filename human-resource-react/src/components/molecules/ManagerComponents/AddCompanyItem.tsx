import React, { useState, FormEvent, useEffect } from 'react';
import { TextField, Button, Box, Grid, InputLabel, Select, MenuItem, FormControl, Avatar } from '@mui/material';
import { HumanResources, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { fetchCompanyItemTypes, fetchSaveCompanyItem } from "../../../store/feature/companyItemSlice";


const AddCompanyItem: React.FC = () => {

    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useDispatch<HumanResources>();
    const [name, setName] = useState<string>('');
    const [companyItemType, setCompanyItemType] = useState([]);
    const [selectedCompanyItemType, setSelectedCompanyItemType] = useState<string>('');
    const [serialNumber, setSerialNumber] = useState<string>('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        dispatch(fetchCompanyItemTypes(token))
            .then(data => {
                setCompanyItemType(data.payload);
            });
    }, [dispatch]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    const addCompanyItem = () => {
        if (selectedCompanyItemType === '' || name === '' || serialNumber === '') {
            Swal.fire({
                icon: 'error',
                text: 'Please fill all the fields!',
                confirmButtonColor: '#1976D2',
            });
            return;
        }

        setLoading(true)

        dispatch(fetchSaveCompanyItem({
            name: name,
            companyItemType: selectedCompanyItemType,
            serialNumber: serialNumber,
            token: token
        }))
            .then((data) => {
                if (data.payload.message) {
                    Swal.fire({
                        icon: 'error',
                        text: data.payload.message ?? 'Failed to add item',
                        showConfirmButton: true,
                        confirmButtonColor: '#1976D2',
                    })

                } else {
                    Swal.fire({
                        icon: 'success',
                        text: 'Item has been added',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        maxWidth: 800,
                        margin: 'auto',
                        padding: 2,
                    }}
                >
                    <TextField
                        required
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <FormControl required variant="outlined">
                        <InputLabel>{'Item Type'}</InputLabel>
                        <Select
                            value={selectedCompanyItemType}
                            onChange={event => setSelectedCompanyItemType(event.target.value as string)}
                            label="Item Type"
                        >
                            {companyItemType.map((companyItemType) => (
                                <MenuItem key={companyItemType} value={companyItemType}>
                                    {companyItemType}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        required
                        label="Serial Number"
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                    />
                    <Grid item style={{ marginBottom: 5 }}></Grid>
                    <Button
                        onClick={addCompanyItem}
                        sx={{ mt: 5 }}
                        type="button"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? "Adding Item..." : "Add Item"}
                    </Button>
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        maxWidth: 800,
                        margin: 'auto',
                        padding: 2,
                    }}
                >
                </Box>
            </Grid>
        </Grid>
    );
};

export default AddCompanyItem;
