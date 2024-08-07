import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {Link, useNavigate} from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {PasswordRounded, SportsTennis} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import {HumanResources} from "../../../store";
import {useState} from "react";
import getUserTypeFromToken from '../../../util/getUserTypeFromToken';
import {fetchGetPasswordResetCode, fetchResetPassword} from "../../../store/feature/passwordResetSlice";
import Swal from "sweetalert2";
import {Grid} from "@mui/material";

const PasswordResetForm: React.FC = () => {
    const dispatch = useDispatch<HumanResources>();
    const navigate = useNavigate();

    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        dispatch(fetchResetPassword({token, newPassword}));
    };

    return (
            <Box
                sx={{
                    my: 8,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Avatar sx={{m: 1, bgcolor: '#606c38'}}>
                    <PasswordRounded/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Reset Password
                </Typography>

                <TextField
                    margin="normal"
                    sx={{mt:2}}
                    required
                    fullWidth
                    id="token"
                    label="Enter reset code"
                    name="token"
                    autoComplete="off"
                    autoFocus
                    onChange={event => setToken(event.target.value)}
                />
                <TextField
                    margin="normal"
                    sx={{mt:2}}
                    required
                    fullWidth
                    name="newPassword"
                    label="New password"
                    type="password"
                    id="newPassword"
                    autoComplete="off"
                    onChange={event => setNewPassword(event.target.value)}
                />
                <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    sx={{mt:2, mb: 2}}
                    onClick={handleSubmit}
                >
                    Reset Password
                </Button>
            </Box>
    );
};

export default PasswordResetForm;