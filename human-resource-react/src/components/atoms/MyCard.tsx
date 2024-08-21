import * as React from 'react';
import { HumanResources, useAppSelector } from "../../store";
import { Box, Grid, Paper, Typography, Divider } from "@mui/material";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {
    fetchManagerAndCompanyNameOfEmployee
} from "../../store/feature/authSlice";
import { AddDocumentIcon } from "./icons";
import { AccountBox, Person } from "@mui/icons-material";

export default function MyCard() {
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const [managerName, setManagerName] = React.useState('');
    const [companyName, setCompanyName] = React.useState('');

    useEffect(() => {
        dispatch(fetchManagerAndCompanyNameOfEmployee(token)).then(data => {
            setCompanyName(data.payload.companyName);
            setManagerName(data.payload.managerName);
        })

    }, []);

    return (

        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: "bold", color: 'myLightColour.main' }}>
                <AccountBox /> My Profile
            </Typography>
            {/* İlk Satır: Kullanıcı Bilgileri ve Fotoğraf */}
            <Grid container spacing={2}>

                <Grid item xs={6}>
                    <Typography sx={{ mb: 1.5, fontWeight: "bold" }} variant="h5">
                        {user.name + " " + user.surname}
                    </Typography>
                    <Typography sx={{ mb: 1.5, fontStyle: "italic" }} variant="body2">
                        {user.email}
                    </Typography>
                    <Typography sx={{ mb: 1.5, fontStyle: "italic" }} variant="body1">
                        {user.title}
                    </Typography>
                </Grid>

                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <img
                        src={user.photo}
                        alt={user.photo}
                        loading="lazy"
                        style={{
                            borderRadius: '8px',
                            maxWidth: '100%',
                            maxHeight: '150px',
                            objectFit: 'contain'  // Görüntünün taşmasını önlemek için
                        }}
                    />
                </Grid>
            </Grid>


            {
                user.userType === 'EMPLOYEE' && (
                    <>
                        <Divider sx={{
                            my: 2,
                            borderBottomWidth: 2,
                            bgcolor: 'rgba(0, 0, 0, 0.87)'
                        }} />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    Manager Name:
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                <Typography variant="body2">
                                    {managerName}
                                </Typography>
                            </Grid>
                        </Grid>
                    </>
                )
            }
            <Divider sx={{
                my: 2,
                borderBottomWidth: 2,
                bgcolor: 'rgba(0, 0, 0, 0.87)'
            }} />

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Company Name:
                    </Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="body2">
                        {companyName}
                    </Typography>
                </Grid>
            </Grid>
            <Divider sx={{ my: 2, borderBottomWidth: 2, bgcolor: 'rgba(0, 0, 0, 0.87)' }} /> {/* Kalın ve Koyu Renkli Divider */}

            {/* Üçüncü Satır: İşe Alım Tarihi */}
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Hire Date:
                    </Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}> {/* Sağda içerik */}
                    <Typography variant="body2">
                        {user.hireDate?.toLocaleString()}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
}
