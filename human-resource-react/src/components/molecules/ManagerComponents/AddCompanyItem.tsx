import React, { useState, FormEvent, useEffect } from 'react';
import { TextField, Button, Box, Grid, InputLabel, Select, MenuItem, FormControl, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { HumanResources, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { fetchCompanyItemTypes, fetchSaveCompanyItem } from "../../../store/feature/companyItemSlice";
import { myErrorColour, myLightColour } from '../../../util/MyColours';

interface AddCompanyItemDialogProps {
    open: boolean;
    onClose: () => void;
}

const AddCompanyItemDialog: React.FC<AddCompanyItemDialogProps> = ({ open, onClose }) => {
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useDispatch<HumanResources>();
    const [name, setName] = useState<string>('');
    const [companyItemType, setCompanyItemType] = useState<string[]>([]);
    const [selectedCompanyItemType, setSelectedCompanyItemType] = useState<string>('');
    const [serialNumber, setSerialNumber] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchCompanyItemTypes(token))
            .then(data => {
                setCompanyItemType(data.payload);
            });
    }, [dispatch]);


    const addCompanyItem = () => {
        if (selectedCompanyItemType === '' || name === '' || serialNumber === '') {
            Swal.fire({
                icon: 'error',
                text: 'Please fill all the fields!',
                confirmButtonColor: myLightColour,
                cancelButtonColor: myErrorColour,
            });
            return;
        }

        setLoading(true);

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
                        confirmButtonColor: myLightColour,
                        cancelButtonColor: myErrorColour,
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        text: 'Item has been added',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
            .finally(() => {
                setName('');
                setSerialNumber('');
                setSelectedCompanyItemType('');
                setLoading(false);
                onClose(); // Close the dialog after submission
            });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add Company Item</DialogTitle>
            <DialogContent>
                <Box component="form">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                label="Name"
                                value={name}
                                fullWidth
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl required variant="outlined" style={{ width: '100%' }}>
                                <InputLabel>Item Type</InputLabel>
                                <Select
                                    value={selectedCompanyItemType}
                                    onChange={event => setSelectedCompanyItemType(event.target.value as string)}
                                    label="Item Type"
                                >
                                    {companyItemType.map((itemType) => (
                                        <MenuItem key={itemType} value={itemType}>
                                            {itemType}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Serial Number"
                                value={serialNumber}
                                onChange={(e) => setSerialNumber(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error" variant="contained" sx={{ marginRight: '17px', width: '100px' }}>
                    Cancel
                </Button>
                <Button
                    onClick={addCompanyItem}
                    color="success"
                    disabled={loading || !serialNumber || !name || !selectedCompanyItemType}
                    variant="contained" sx={{ marginRight: '17px', width: '100px' }}
                >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddCompanyItemDialog;
