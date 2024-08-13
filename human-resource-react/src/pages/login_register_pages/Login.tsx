import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import LoginCard from './LoginCard';
import { NavBar } from "../../components/molecules/PreAuthorizedPageComponents/NavBar";

export default function Login() {
    return (
        <>
            <NavBar />
            <CssBaseline />
            <Grid item xs={12} sm={10} md={8} lg={6}
                sx={{
                    marginTop: '100px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 2,
                }}>
                <LoginCard />
            </Grid>
        </>

    );
}

