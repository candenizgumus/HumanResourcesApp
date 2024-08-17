import * as React from 'react';
import {Grid, TextField, Box, Button, Alert, Collapse, Typography} from "@mui/material";
import { useState, useEffect } from "react";
import {useDispatch} from "react-redux";
import {HumanResources, useAppSelector} from "../../store";
import {clearToken, fetchDeactivateMyAccount} from "../../store/feature/authSlice";
import sweetalert2 from "sweetalert2";

const DeactivateAccount: React.FC = () => {
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {

    }, [password,error]);


    const handleChangePassword = () => {
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
        <Grid container spacing={2} >
            <Grid item xs={4} />

            <Grid item sx={{ alignItems: 'center', textAlign: 'center', width: '90%' }} xs={4}>
                <Box
                    sx={{
                        padding: 2,
                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                        border: '1px solid red',
                        borderRadius: 1,
                        fontWeight: 'bold',
                        color: 'red',
                        marginBottom: 2
                    }}
                >
                    <Typography variant="h6">
                        Warning: If you deactivate your account, you will no longer be able to log in.
                    </Typography>
                </Box>
                    <TextField
                        sx={{ marginY: 5 }}
                        fullWidth
                        id="outlined-basic"
                        label="Please Enter Your Password"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                    />



                <Button disabled={password.length === 0} onClick={handleChangePassword}    sx={{ marginBottom: 5 }} variant="contained">Deactivate My Account</Button>



            </Grid>

            <Grid item xs={4} />
        </Grid>
    );
}

export default DeactivateAccount;
