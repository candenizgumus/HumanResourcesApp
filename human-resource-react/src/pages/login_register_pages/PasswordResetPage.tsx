import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CodeOffRounded, CodeRounded, PasswordRounded, SportsTennis, TokenRounded } from "@mui/icons-material";
import PasswordResetRequestForm from "../../components/molecules/PreAuthorizedPageComponents/PasswordResetRequestForm";
import { Grid } from "@mui/material";
import PasswordResetForm from "../../components/molecules/PreAuthorizedPageComponents/PasswordResetForm";
import { NavBar } from "../../components/molecules/PreAuthorizedPageComponents/NavBar";
import CssBaseline from "@mui/material/CssBaseline";
import LoginCard from "./LoginCard";
import { useRef } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
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
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
}));

const Footer = styled('footer')(({ theme }) => ({
    padding: theme.spacing(0),
}));

export default function PasswordResetPage() {
    const featuresRef = useRef<HTMLDivElement>(null);
    const isResetCodeSend = useSelector((state: RootState) => state.passwordReset.isResetCodeSend);

    return (
        <ThemeElement children={
            <Root>
                <NavBar />
                <CssBaseline />
                <Body>
                    <Grid item sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Paper elevation={6} square sx={{ width: '100%', maxWidth: 400}}>
                            <PasswordResetRequestForm />
                            {isResetCodeSend ? <PasswordResetForm /> : ''}
                        </Paper>
                    </Grid >
                </Body>
                <Footer>
                    <CssBaseline />
                    <FooterElement />
                </Footer>
            </Root>
        } />
    );
}


