import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import LoginCard from './LoginCard';
import { NavBar } from "../../components/molecules/PreAuthorizedPageComponents/NavBar";
import ThemeElement from '../../components/atoms/ThemeElement';
import { styled } from '@mui/material/styles';
import FooterElement from '../../components/molecules/PreAuthorizedPageComponents/FooterElement';

const Root = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: theme.palette.myBackgroundColour.main,
}));

const Body = styled('main')(({ theme }) => ({
    flex: '1',
    width: '100%',
    marginTop: theme.spacing(12),
}));

const Footer = styled('footer')(({ theme }) => ({
    padding: theme.spacing(0),
}));

export default function Login() {
    return (
        <ThemeElement children={
            <Root>
                <NavBar />
                <CssBaseline />
                <Body>
                    <Grid container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <LoginCard />
                    </Grid>
                </Body>
                <Footer>
                    <CssBaseline />
                    <FooterElement />
                </Footer>
            </Root>
        } />

    );
}

