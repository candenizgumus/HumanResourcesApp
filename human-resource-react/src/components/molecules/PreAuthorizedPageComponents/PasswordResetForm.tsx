import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {Link, useNavigate} from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {PasswordRounded, SportsTennis} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import {HumanResources} from "../../../store";
import {useState} from "react";
import { useLocation } from 'react-router-dom';
import {fetchResetPassword} from "../../../store/feature/passwordResetSlice";
import Swal from "sweetalert2";

const PasswordResetForm: React.FC = () => {
    const dispatch = useDispatch<HumanResources>();

    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    React.useEffect(() => {
        // Get the token from the URL query params
        const searchParams = new URLSearchParams(location.search);
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, [location.search]);

    const handleSubmit = async () => {
        
        if (!token || !newPassword) {
            setError("Both fields are required.");
            return;
        }
        let result = await dispatch(fetchResetPassword({token, newPassword})).unwrap();

        if (result.code) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: result.message,
            });
        }

        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Password Reset Successfull.',
          }).then(()=>{
            navigate("/login")
          })
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
                    value={token}
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
                {error && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                    {error}
                </Typography>
                )}
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