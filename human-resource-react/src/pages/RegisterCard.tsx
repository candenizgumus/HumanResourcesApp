import * as React from 'react';
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
import { SportsTennis } from '@mui/icons-material';
// import { AppDispatch, useAppSelector } from '../../store';
// import { useDispatch } from 'react-redux';
// import { fetchRegister } from '../../store/feature/authSlice.tsx';


export default function RegisterCard() {

    // const dispatch: AppDispatch = useDispatch();
    // const { data, message } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();

    const [formData, setFormData] = React.useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        rePassword: ''
    });

    const [isPasswordMatch, setIsPasswordMatch] = React.useState(true)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'password' || name === 'rePassword') {
            setIsPasswordMatch(formData.password === value || formData.rePassword === value);
        }
    };

    // const register = () => {
    //     dispatch(fetchRegister({
    //         firstname: formData.firstname,
    //         lastname: formData.lastname,
    //         email: formData.email,
    //         password: formData.password
    //     })).then((returnData) => {
    //         if (returnData.payload) {
    //             navigate('/login');
    //         }
    //     });
    // }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isPasswordMatch) {
            return;
        }
        // register();
    };

    return (
        <Paper elevation={6} square sx={{ width: '100%', maxWidth: 400}}>
            <Box
                sx={{
                    my: 8,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: '#606c38' }}>
                    <SportsTennis />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="normal"
                                autoComplete="given-name"
                                name="firstname"
                                required
                                fullWidth
                                id="firstname"
                                label="First Name"
                                autoFocus
                                value={formData.firstname}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="lastname"
                                label="Last Name"
                                name="lastname"
                                autoComplete="family-name"
                                value={formData.lastname}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
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
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="rePassword"
                        label="Confirm Password"
                        type="password"
                        id="rePassword"
                        autoComplete="current-password"
                        value={formData.rePassword}
                        onChange={handleChange}
                        error={!isPasswordMatch}
                        helperText={!isPasswordMatch ? 'Passwords must match!' : ''}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Register
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            {/* <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link> */}
                        </Grid>
                        <Grid item>
                            <Typography variant="body2">
                                <Link to={'/login'}>
                                    {"Already Have an Account, Log In!"}
                                </Link>
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Paper>
    );
}