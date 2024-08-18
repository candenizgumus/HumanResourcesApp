import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import LoginCard from './LoginCard';
import { NavBar } from "../../components/molecules/PreAuthorizedPageComponents/NavBar";

export default function Login() {
    return (
        <>
            <NavBar />
            <CssBaseline />
            <Grid item
                sx={{
                    marginTop: '100px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <LoginCard />
            </Grid>
        </>

    );
}

