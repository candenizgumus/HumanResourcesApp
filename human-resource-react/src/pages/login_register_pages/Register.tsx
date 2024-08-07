
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import RegisterCard from './RegisterCard';
import Box from "@mui/material/Box";


export default function Register() {

    return (

        <Grid
            container
            component="main"
            sx={{
                height: '100vh',
                backgroundColor: (t) =>
                    t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <CssBaseline />
            <Grid item xs={12} sm={10} md={8} lg={6}
                  sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      maxWidth: 500, // Adjusted max width for larger screens
                      width: '100%',
                      padding: 2,
                      boxSizing: 'border-box',
                  }}>
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
