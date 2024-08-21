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
import { changePageState, fetchFindUserByToken, fetchLogin } from "../../store/feature/authSlice";
import { HumanResources, RootState } from "../../store";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { Alert, Collapse } from "@mui/material";
import getUserTypeFromToken from '../../util/getUserTypeFromToken';
import { myErrorColour, myLightColour } from '../../util/MyColours';

export default function LoginCard() {
    const dispatch = useDispatch<HumanResources>();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isError, setIsError] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);

    const handleLogin = async () => {
        let result;
        try {
            result = await dispatch(fetchLogin({ email, password })).unwrap();

            if (result.code) {
                setIsError(true);
                setError(result.message);
                return; // İşlemi sonlandırarak sonraki then bloklarına geçişi engeller.
            }
        } catch {
            Swal.fire({
                icon: 'error',
                text: 'Server not responding. Try again later.',
                confirmButtonColor: myLightColour,
                cancelButtonColor: myErrorColour,
            });
            return;
        }

        // `result` içinde `code` özelliği olup olmadığını kontrol edin


        await dispatch(fetchFindUserByToken(result.token));


        const userType = getUserTypeFromToken(result.token);
        if (userType === 'ADMIN') {
            dispatch(changePageState("Dashboard"));
            navigate('/admin-home');
        } else if (userType === 'MANAGER') {
            dispatch(changePageState("Dashboard"));
            navigate('/manager-home');
        } else if (userType === 'EMPLOYEE') {
            dispatch(changePageState("Dashboard"));
            navigate('/employee-home');
        } else {
            navigate('/');
        }

    };
    useEffect(() => {
        if (isError) {
            const timer = setTimeout(() => {
                setIsError(false); // isError durumunu false yaparak hatayı gizle
            }, 2000); // 3 saniye sonra hata kaybolacak

            return () => clearTimeout(timer); // Temizlik yaparak zamanlayıcıyı temizle
        }
    }, [isError, setIsError]);

    return (
        <Paper elevation={6} square sx={{ width: '100%', maxWidth: 400, borderRadius: '16px' }}>
            <Box
                sx={{
                    my: 4,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'myLightColour.main' }}>
                    <LoginIcon color='primary' />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Login
                </Typography>

                <Collapse sx={{ width: '100%' }} in={isError}>
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
                    color='success'
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleLogin}
                >
                    LOGIN
                </Button>
                <Grid container>

                    <Grid item xs={12}>
                            <Button fullWidth type="button" variant="contained" color="info" onClick={() => navigate('/password-reset')}>
                                Forgot Password
                            </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
}
