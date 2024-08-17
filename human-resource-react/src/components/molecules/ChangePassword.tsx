import * as React from 'react';
import {Grid, TextField, Box, Button, Alert, Collapse} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState, useEffect } from "react";
import {useDispatch} from "react-redux";
import {HumanResources, useAppSelector} from "../../store";
import {fetchChangePassword} from "../../store/feature/authSlice";
import sweetalert2 from "sweetalert2";
import PinIcon from '@mui/icons-material/Pin';
const ChangePassword: React.FC = () => {
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [reNewPassword, setReNewPassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Şifre uzunluğu kontrolü (8 veya daha fazla karakter doğru kabul edilir)
        checkPasswords()
    }, [isPasswordValid,reNewPassword,newPassword,password]);

    const checkPasswords     = () => {
        if (newPassword !==reNewPassword && newPassword.length>0 && reNewPassword.length>0) {
            setIsPasswordValid(true);
            setError('Passwords do not match');
        }
        else if (newPassword.length<8 && reNewPassword.length<8 && newPassword.length>0 && reNewPassword.length>0) {
            setIsPasswordValid(true);
            setError('Password length must be at least 8 characters');
        }
        else{
            setIsPasswordValid(false);
        }
    }
    const handleChangePassword = () => {
        if ( newPassword === '' || reNewPassword === '' || reNewPassword === '') {
            sweetalert2.fire({
                icon: 'error',
                title: 'Please fill all the fields',
                showConfirmButton: false,
                timer: 1500

            })
            return;
        }
        dispatch(fetchChangePassword({
            token: token,
            password: password,
            newPassword: newPassword
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
                    title: 'Your password has been changed successfully',
                    showConfirmButton: false,
                    timer: 1500
                })
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
            <Collapse in={isPasswordValid}>
                <Box sx={{ width: '100%' }}>
                    <Alert severity="error"
                            sx={{
                                width: '100%',
                                textAlign: 'center', // Metni ortala
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                    >
                        {error}
                    </Alert>
                </Box>
            </Collapse>
            <TextField
                fullWidth
                id="outlined-basic"
                label="Please Enter Your Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
            />
            <TextField
                fullWidth
                id="outlined-basic"
                label="Please Enter Your New Password"
                variant="outlined"
                type="password"
                value={newPassword}
                onChange={event => setNewPassword(event.target.value)}
            />
            <TextField
                fullWidth
                id="outlined-basic"
                label="Please Enter Your Re Password"
                variant="outlined"
                type="password"
                value={reNewPassword}
                onChange={event => setReNewPassword(event.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleChangePassword}
                disabled={isPasswordValid || !password || !newPassword || !reNewPassword}
                startIcon={<PinIcon />}
            >
                Change Password
            </Button>
        </Box>
  );
}

export default ChangePassword;
