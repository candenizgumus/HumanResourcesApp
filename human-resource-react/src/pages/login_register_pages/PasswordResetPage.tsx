import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {CodeOffRounded, CodeRounded, PasswordRounded, SportsTennis, TokenRounded} from "@mui/icons-material";
import PasswordResetRequestForm from "../../components/molecules/PasswordResetRequestForm";
import {Grid} from "@mui/material";
import PasswordResetForm from "../../components/molecules/PasswordResetForm";
import {NavBar} from "../../components/molecules/NavBar";
import CssBaseline from "@mui/material/CssBaseline";
import LoginCard from "./LoginCard";
import {useRef} from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export default function PasswordResetPage() {
    const featuresRef = useRef<HTMLDivElement>(null);
    const isResetCodeSend = useSelector((state: RootState) => state.passwordReset.isResetCodeSend);

    return (
        <Grid
            container
            component="main"
            sx={{
                height: '90vh',
                backgroundColor: (t) =>
                    t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <NavBar/>
            <CssBaseline/>
            <Grid item xs={12} sm={10} md={8} lg={6}
                  sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      maxWidth: 500,
                      width: '100%',
                      padding: 2,
                      boxSizing: 'border-box',
                  }}>
                <Box
                    sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        maxWidth: 500,
                        width: '100%',
                        padding: 2,
                        boxSizing: 'border-box',
                    }}
                >
                    <Paper elevation={6} square sx={{width: '100%', maxWidth: 400}}>
                        <PasswordResetRequestForm/>
                        {isResetCodeSend ? <PasswordResetForm/> : ''}
                            
                    </Paper>
                </Box>
            </Grid>
        </Grid>

    );
}


