import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {Link, useNavigate} from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {SportsTennis} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import {fetchFindUserByToken, fetchLogin} from "../../store/feature/authSlice";
import {HumanResources, useAppSelector} from "../../store";

import {useState} from "react";
import {Alert, AlertTitle} from "@mui/material";
import getUserTypeFromToken from '../../util/getUserTypeFromToken';

export default function LoginCard() {
    const dispatch = useDispatch<HumanResources>();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const handleLogin = async () => {
        let result = await dispatch(fetchLogin({ email, password })).unwrap();

        // `result` içinde `code` özelliği olup olmadığını kontrol edin
        if (result.code) {
            setError(result.message);
            return; // İşlemi sonlandırarak sonraki then bloklarına geçişi engeller.
        }
        navigate('/main-page');
    };

    return (
        <Paper elevation={6} square sx={{width: '100%', maxWidth: 400}}>
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
                    <SportsTennis/>
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

                            {error+ ' '}
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
                    control={<Checkbox value="remember" color="primary"/>}
                    label="Remember me"
                />
                <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    sx={{mt: 3, mb: 2}}
                    onClick={handleLogin}
                >
                    Log In
                </Button>
                <Grid container>
                    <Grid item xs>
                        {/* <Link href="#" variant="body2">
                            Forgot password?
                        </Link> */}
                    </Grid>
                    <Grid item>
                        <Typography variant='body2'>
                            <Link to={'/register'}>
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
}
