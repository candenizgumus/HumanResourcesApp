import React, {useEffect, useState} from 'react';
import { HumanResources, useAppSelector } from "../../../store";
import {Container, Grid, TextField, Typography} from "@mui/material";
import SlideCard from './SlideCard';
import { useDispatch } from 'react-redux';
import { fetchGetAllSlides } from '../../../store/feature/slideSlice';
import {BorderHorizontal, HorizontalSplit} from "@mui/icons-material";
import Divider from "@mui/material/Divider";

const SideBarSlides = (props: { open: boolean}) => {
    const slides = useAppSelector((state) => state.slide.slides);
    const token = useAppSelector((state) => state.auth.token);
    const dispatch: HumanResources = useDispatch();

    const[city, setCity] = useState('');
    const[district, setDistrict] = useState('');
    const[neighborhood, setNeighborhood] = useState('');
    const[projection, setProjection] = useState('');
    const[concept, setConcept] = useState('');
    const fetchData = async () => {
        try {
            const result = await dispatch(fetchGetAllSlides({token: token, city: city, district: district, neighborhood: neighborhood, projection: projection, concept: concept})).unwrap();
            if (!result.code) {
                // handle success if needed
            } else {
                console.error('Unexpected result format:', result);
            }
        } catch (error) {
            console.error('Error fetching:', error);
        }
    };
    useEffect(() => {

        fetchData();
    }, [dispatch, token, city, district, neighborhood, projection, concept]);

    return (
        <>
            <Typography variant="h6" textAlign="center" sx={{ mb: 1, fontWeight: "bold", }}>FILTER</Typography>
            <Grid container spacing={2} sx={{ marginBottom: 3 }}>

                <Grid item xs={2.4}>
                    <TextField
                        label="City"
                        variant="outlined"
                        onChange={(event) => setCity(event.target.value)}
                        value={city}
                        sx={{ marginTop: 3 }}
                        fullWidth
                        inputProps={{ maxLength: 50 }}
                    />
                </Grid>
                <Grid item xs={2.4}>
                    <TextField

                        label="District"
                        variant="outlined"
                        onChange={(event) => setDistrict(event.target.value)}
                        value={district}
                        sx={{ marginTop: 3 }}
                        fullWidth
                        inputProps={{ maxLength: 50 }}
                    />
                </Grid>
                <Grid item xs={2.4}>
                    <TextField

                        label="Neighborhood"
                        variant="outlined"
                        onChange={(event) => setNeighborhood(event.target.value)}
                        value={neighborhood}
                        sx={{ marginTop: 3 }}
                        fullWidth
                        inputProps={{ maxLength: 50 }}
                    />
                </Grid>
                <Grid item xs={2.4}>
                    <TextField

                        label="Projection"
                        variant="outlined"
                        onChange={(event) => setProjection(event.target.value)}
                        value={projection}
                        sx={{ marginTop: 3 }}
                        fullWidth
                        inputProps={{ maxLength: 50 }}
                    />
                </Grid>
                <Grid item xs={2.4}>
                    <TextField

                        label="Concept"
                        variant="outlined"
                        onChange={(event) => setConcept(event.target.value)}
                        value={concept}
                        sx={{ marginTop: 3 }}
                        fullWidth
                        inputProps={{ maxLength: 50 }}
                    />
                </Grid>
            </Grid>
            <Divider sx={{ marginY: 3  , border: '2px solid black'  }} />
            <Grid container spacing={4}>
                {slides.map((slide) => (
                    <Grid item xs={12} sm={12} md={6} lg={4} key={slide.id}>
                        <SlideCard
                            slide={slide}
                            open={props.open}
                            fetchMethod={fetchData}

                        />
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default SideBarSlides;
