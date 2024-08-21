import React, {useState} from 'react';
import {TextField, Button, Box, Grid, Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';
import {HumanResources, useAppSelector} from "../../../store";
import {useDispatch} from "react-redux";
import Swal from "sweetalert2";
import {fetchRejectItemAssignmentByEmployee} from "../../../store/feature/companyItemSlice";
import {ApproveIcon} from "../../atoms/icons";

interface RejectItemAssignmentDialogProps {
    open: boolean;
    onClose: () => void;
    selectedCompanyItemId: number | null; // Add prop for the selected item ID
}

const RejectItemAssignmentDialog: React.FC<RejectItemAssignmentDialogProps> = ({
                                                                                   open,
                                                                                   onClose,
                                                                                   selectedCompanyItemId
                                                                               }) => {
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useDispatch<HumanResources>();
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const rejectCompanyItem = () => {
        if (!selectedCompanyItemId) {
            Swal.fire({
                icon: 'error',
                text: 'No item selected!',
                confirmButtonColor: '#1976D2',
            });
            return;
        }

        if (message === '') {
            Swal.fire({
                icon: 'error',
                text: 'Please specify a reason!',
                showConfirmButton: false,
                timer: 1500
            });
            onClose();
            return;
        }

        setLoading(true);

        dispatch(fetchRejectItemAssignmentByEmployee({
            id: selectedCompanyItemId,
            token: token,
            message: message
        }))
            .then((data) => {
                if (data.payload.message) {
                    Swal.fire({
                        icon: 'error',
                        text: data.payload.message ?? 'Failed to reject assignment',
                        showConfirmButton: true,
                        confirmButtonColor: '#1976D2',
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        text: 'Assignment has been rejected',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
            .finally(() => {
                setMessage('');
                setLoading(false);
                onClose(); // Close the dialog after submission
            });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Reject Item Assignment</DialogTitle>
            <DialogContent>
                <Box component="form">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <TextField
                                required
                                fullWidth
                                label="Rejection Reason"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="contained"
                        color="error"
                        startIcon={<ApproveIcon />} onClick={onClose}
                >
                    Cancel
                </Button>
                <Button variant="contained"
                        color="success"
                        startIcon={<ApproveIcon />} onClick={rejectCompanyItem}  disabled={loading}>
                    Reject
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default RejectItemAssignmentDialog;