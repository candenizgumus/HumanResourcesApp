import {Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField} from "@mui/material";
import DatePicker from "react-datepicker";
import React from "react";
import {fetchGetPasswordResetCode} from "../../store/feature/passwordResetSlice";
import {useDispatch} from "react-redux";
import {HumanResources} from "../../store";
import Swal from "sweetalert2";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import {CodeRounded} from "@mui/icons-material";


const PasswordResetRequestForm: React.FC = () => {
    const dispatch = useDispatch<HumanResources>();
    const [email, setEmail] = React.useState<string>('');

    const handleSubmit = (email: string) => {
        dispatch(fetchGetPasswordResetCode({email}))
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Password reset code has been sent.',
                });
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
                <Avatar sx={{mt: 3, mb:1, bgcolor: '#606c38'}}>
                    <CodeRounded/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Get Password Reset Code
                </Typography>

                <TextField
                    sx={{mt:2}}
                    label="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                    autoComplete="off"
                />
                <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    sx={{mt:2, mb: 2}}
                    onClick={() => handleSubmit(email)}
                >
                    Get password reset code
                </Button>
            </Box>
    );
};

export default PasswordResetRequestForm;