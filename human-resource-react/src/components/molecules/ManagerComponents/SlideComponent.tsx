import React, { useEffect } from 'react';
import { HumanResources, useAppSelector } from "../../../store";
import { Container, Grid } from "@mui/material";
import SlideCard from './SlideCard';
import { useDispatch } from 'react-redux';
import { fetchGetAllSlides } from '../../../store/feature/slideSlice';

const SlideComponent = (props: { open: boolean}) => {
    const slides = useAppSelector((state) => state.slide.slides);
    const token = useAppSelector((state) => state.auth.token);
    const dispatch: HumanResources = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await dispatch(fetchGetAllSlides(token)).unwrap();
                if (!result.code) {
                    // handle success if needed
                } else {
                    console.error('Unexpected result format:', result);
                }
            } catch (error) {
                console.error('Error fetching:', error);
            }
        };
        fetchData();
    }, [dispatch, token]);

    return (
        <Container maxWidth="lg" sx={{ marginBottom: '10%' }}>
            <Grid container spacing={4}>
                {slides.map((slide) => (
                    <Grid item xs={12} sm={12} md={6} lg={4} key={slide.id}>
                        <SlideCard
                            slide={slide}
                            open={props.open}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default SlideComponent;
