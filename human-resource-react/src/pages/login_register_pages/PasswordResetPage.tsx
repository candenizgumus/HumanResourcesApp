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

export default function PasswordResetPage() {
    const featuresRef = useRef<HTMLDivElement>(null);
    const isResetCodeSend = useSelector((state: RootState) => state.passwordReset.isResetCodeSend);

    return (
        <>
            <NavBar />
            <CssBaseline />
            <Grid item sx={{
                marginTop: '100px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Paper elevation={6} square sx={{ width: '100%', maxWidth: 400 }}>
                    <PasswordResetRequestForm />
                    {isResetCodeSend ? <PasswordResetForm /> : ''}
                </Paper>
            </Grid >
        </>
    );
}


