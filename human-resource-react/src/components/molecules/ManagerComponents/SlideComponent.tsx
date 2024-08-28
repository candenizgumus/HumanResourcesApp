import React, { useEffect } from 'react';
import { HumanResources, useAppSelector } from "../../../store";
import { Container, Grid } from "@mui/material";
import SlideCard from './SlideCard';
import { useDispatch } from 'react-redux';
import { fetchGetAllSlides } from '../../../store/feature/slideSlice';
const SlideComponent = () => {
    const slides = useAppSelector((state) => state.slide.slides);
    const token= useAppSelector((state) => state.auth.token)
    const dispatch: HumanResources = useDispatch();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await dispatch(fetchGetAllSlides(
                    token
                )).unwrap();
                if (!result.code) {
                   
                } else {
                    console.error('Unexpected result format:', result);
                }
            } catch (error) {
                console.error('Error fetching:', error);
            }
        };
        fetchData();
    }, [dispatch]);
    return (
        <Container maxWidth="lg">
            <Grid container spacing={4} sx={{ marginBottom: '10%' }}>
                {slides.map((slide) => (
                    <SlideCard
                        key={slide.id}
                        id={slide.id}
                        mobileImageUrls={slide.mobileImageUrls}
                        desktopImageUrls={slide.desktopImageUrls}
                        sehir={slide.sehir}
                        ilce={slide.ilce}
                        mahalle={slide.mahalle}
                        projeksiyon={slide.projeksiyon}
                        konsept={slide.konsept}
                    />
                ))}
            </Grid>
        </Container>
    );
};

export default SlideComponent;
