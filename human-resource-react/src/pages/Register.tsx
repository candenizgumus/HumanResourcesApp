
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import backgroundImage from '../../src/images/Screenshot 2024-07-30 at 16.28.41 2.png'
import RegisterCard from './RegisterCard';
import Box from "@mui/material/Box";


export default function Register() {

    return (

        <Grid
            container
            component="main"
            sx={{
                height: '100vh',
                backgroundImage: `url(${backgroundImage})`,
                backgroundColor: (t) =>
                    t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <CssBaseline />
            <Grid item>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        maxWidth: 500, // Adjusted max width for larger screens
                        width: '100%',
                        padding: 2,
                        boxSizing: 'border-box',
                    }}
                >
                    <RegisterCard />
                </Box>
            </Grid>
        </Grid>

    );
}
