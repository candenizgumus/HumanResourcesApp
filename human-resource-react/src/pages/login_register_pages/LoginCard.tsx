import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LoginIcon from '@mui/icons-material/Login';
import { useDispatch, useSelector } from "react-redux";
import { fetchFindUserByToken, fetchLogin } from "../../store/feature/authSlice";
import { HumanResources, RootState } from "../../store";

import { useState } from "react";
import { Alert } from "@mui/material";
import getUserTypeFromToken from '../../util/getUserTypeFromToken';

export default function LoginCard() {
    const dispatch = useDispatch<HumanResources>();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const user = useSelector((state: RootState) => state.auth.user);

    const handleLogin = async () => {

        let result = await dispatch(fetchLogin({ email, password })).unwrap();
        // `result` içinde `code` özelliği olup olmadığını kontrol edin
        if (result.code) {
            setError(result.message);
            return; // İşlemi sonlandırarak sonraki then bloklarına geçişi engeller.
        }

        await dispatch(fetchFindUserByToken(result.token));

        const userType = getUserTypeFromToken(result.token);
        if (userType === 'ADMIN') {
            navigate('/admin-home');
        } else if (userType === 'MANAGER') {
            navigate('/manager-home');
        } else if (userType === 'EMPLOYEE') {
            navigate('/employee-home');
        } else {
            navigate('/');
        }

    };


    return (
        <Paper elevation={6} square sx={{ width: '100%', maxWidth: 400 }}>
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
                <Avatar sx={{ m: 1, bgcolor: '#606c38' }}>
                    <LoginIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Login
                </Typography>

                {error && (
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

                            {error + ' '}
                            <strong>Try Again!</strong>
                        </Alert>
                    </Box>
                )}

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    onChange={event => setEmail(event.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={event => setPassword(event.target.value)}
                />
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                />
                <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleLogin}
                >
                    Log In
                </Button>
                <Grid container>
                    <Grid item xs>
                    </Grid>
                    <Grid item>
                        <Typography variant='body2'>
                            <Link to={'/password-reset'}>
                                Forgot password?
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
}
