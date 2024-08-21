import * as React from 'react';
import { Grid, TextField, Box, Button, Alert, Collapse, Typography, FormControlLabel, Checkbox } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { HumanResources, useAppSelector } from "../../store";
import { clearToken, fetchDeactivateMyAccount } from "../../store/feature/authSlice";
import sweetalert2 from "sweetalert2";
import { CancelIcon } from '../atoms/icons';
import { myErrorColour, myLightColour } from '../../util/MyColours';
const DeactivateAccount: React.FC = () => {
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [deactivateAll, setDeactivateAll] = useState(false);
    const user = useAppSelector((state) => state.auth.user);
    useEffect(() => {

    }, [password, error]);


    const handleDeactivateMyAccount = () => {
        if (email !== user.email) {
            sweetalert2.fire({
                icon: 'error',
                title: 'Incorrect E-Mail',
                showConfirmButton: false,
                timer: 1500
            })
            return;
        }
        if (deactivateAll) {
            sweetalert2.fire({
                icon: 'warning',
                title: 'Are you sure? All accounts in the company will be deactivated.',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonColor: myLightColour, // Replace with your light color value
                cancelButtonColor: myErrorColour, // Replace with your error color value
            }).then((result) => {
                if (result.isConfirmed) {
                    // User clicked "Confirm"
                    // Proceed with deactivation
                    dispatch(fetchDeactivateMyAccount({
                        token: token,
                        password: password,
                        deactivateAll: deactivateAll
                    })).then(data => {
                        if (data.payload.message) {
                            setError(data.payload.message)
                            sweetalert2.fire({
                                icon: 'error',
                                title: data.payload.message,
                                showConfirmButton: false,
                                timer: 1500
                            })
            
                        }
                        else {
                            sweetalert2.fire({
                                icon: 'success',
                                title: 'Your account deactivated successfully',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            dispatch(clearToken())
                        }
                    });
                } else if (result.dismiss === sweetalert2.DismissReason.cancel) {
                    // User clicked "Cancel"
                    setDeactivateAll(false);
                    setEmail('');
                    setPassword('');
                }
            });
        }else {
            dispatch(fetchDeactivateMyAccount({
                token: token,
                password: password,
                deactivateAll: deactivateAll
            })).then(data => {
                if (data.payload.message) {
                    setError(data.payload.message)
                    sweetalert2.fire({
                        icon: 'error',
                        title: data.payload.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
    
                }
                else {
                    sweetalert2.fire({
                        icon: 'success',
                        title: 'Your account deactivated successfully',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    dispatch(clearToken())
                }
            });
        }   
    }
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: 400,
                margin: 'auto',
                padding: 2,
                marginTop: '2%'
            }}
        >
            <Box
                sx={{
                    padding: 2,
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    border: '1px solid red',
                    borderRadius: 1,
                    fontWeight: 'bold',
                    color: 'red',
                }}
            >
                <Typography variant="h6">
                    Warning: If you deactivate your account, you will no longer be able to log in.
                </Typography>
            </Box>
            <TextField
                fullWidth
                id="outlined-basic"
                label="Please Enter Your Email"
                variant="outlined"
                type="email"
                value={email}
                required
                onChange={event => setEmail(event.target.value)}
            />
            <TextField
                fullWidth
                id="outlined-basic"
                label="Please Enter Your Password"
                variant="outlined"
                type="password"
                value={password}
                required
                onChange={event => setPassword(event.target.value)}
            />{
                user.userType === 'MANAGER' && (
                    <FormControlLabel
                control={
                    <Checkbox
                        checked={deactivateAll}
                        onChange={e => setDeactivateAll(e.target.checked)}
                    />
                }
                label="Deactivate All Acounts Related To This User"
            />
                )
            }
            <Button
                variant="contained"
                color="success"
                disabled={password.length === 0}
                onClick={handleDeactivateMyAccount}
                startIcon={<CancelIcon />}
            >
                Deactivate My Account
            </Button>
        </Box>
    );
}

export default DeactivateAccount;
