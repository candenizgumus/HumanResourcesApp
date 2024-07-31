import {AppBar, Button, Toolbar, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

export const NavBar = () => {
    const navigate = useNavigate();
    const navigateToLogin = () => {
        navigate('/login');
    }

    const navigateToGetOffer = () => {
        navigate('/getoffer');
    }
    return (

        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Kolay İK
                    </Typography>
                    <Button onClick={() => navigateToLogin()} color="inherit">Login</Button>
                    <Button onClick={() => navigateToGetOffer()} color="inherit">Get Offer</Button>
                </Toolbar>
            </AppBar>
        </>
    );
};
