import React, { useEffect, useRef } from 'react';
import { Container, Typography, Grid, Box, Paper, Avatar } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import AppsIcon from '@mui/icons-material/Apps';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SupportIcon from '@mui/icons-material/Support';
import FeatureCard from "./FeatureCard";
import { HumanResources, RootState } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetFeatures } from "../../../store/feature/featureSlice";
import ThemeElement from '../../atoms/ThemeElement';

const features = [
    { icon: <SecurityIcon fontSize="large" />, title: 'High Data Security', description: 'With Easy HR, all data communication between users is protected with SSL certificates in accordance with international security standards.' },
    { icon: <AppsIcon fontSize="large" />, title: 'Free Applications', description: 'Get many free applications such as personnel management, bank integration, overtime, meal card, training and development management with Easy HR.' },
    { icon: <LocalOfferIcon fontSize="large" />, title: 'Reasonable Prices', description: 'Choose the packages that suit your company, use them if you don\'t like them, pay as you use them.' },
    { icon: <SupportIcon fontSize="large" />, title: 'Lifetime Support', description: 'You can reach our lifetime support team, which is ready to help you whenever you have a problem, by phone or e-mail.' },
];

const FeaturesSection = () => {
    const dispatch: HumanResources = useDispatch();
    const featureList = useSelector((state: RootState) => state.feature.featuresList);
    const featuresRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        dispatch(fetchGetFeatures());
    }, [dispatch]);
    return (
        <ThemeElement children={
            <Box sx={{ py: 8, bgcolor: 'myBackgroundColour.main' }}>
                <Container maxWidth="lg">
                    <Typography component="h1" variant="h4" align="center" color="primary.main" gutterBottom sx={{ paddingBottom: 5 }}>
                        Features
                    </Typography>
                    <Grid container spacing={4}>
                        {featureList.slice(0, 3).map((feature) => (
                            <FeatureCard
                                key={feature.id}
                                name={feature.name}
                                shortDescription={feature.shortDescription}
                                iconPath={feature.iconPath}
                                isNavigatable={true}
                            />
                        ))}
                    </Grid>
                </Container>
            </Box>
        } />
    );
};

export default FeaturesSection;