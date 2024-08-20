import * as React from 'react';
import { Grid, TextField, Box, Button, Alert, Collapse, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { HumanResources, useAppSelector } from "../../store";
import { clearToken, fetchDeactivateMyAccount } from "../../store/feature/authSlice";
import sweetalert2 from "sweetalert2";
import { CancelIcon } from '../atoms/icons';
const DeactivateAccount: React.FC = () => {
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const user = useAppSelector((state) => state.auth.user);
    useEffect(() => {
    
    }, [password, error]);


    const handleChangePassword = () => {
        if(email !== user.email){
            sweetalert2.fire({
                icon: 'error',
                title: 'Incorrect E-Mail',
                showConfirmButton: false,
                timer: 1500
            })
            return;
        }
        dispatch(fetchDeactivateMyAccount({
            token: token,
            password: password,
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
            />
            <Button
                variant="contained"
                color="success"
                disabled={password.length === 0}
                onClick={handleChangePassword}
                startIcon={<CancelIcon />}
            >
                Deactivate My Account
            </Button>
        </Box>
    );
}

export default DeactivateAccount;
