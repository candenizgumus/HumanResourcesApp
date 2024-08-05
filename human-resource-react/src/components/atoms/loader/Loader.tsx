import React from 'react';
import { Grid } from '@mui/material';
import './Loader.css';

function Loader() {
    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{ height: '100vh' }} // Full viewport height to center vertically
        >
            <section className="dots-container">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </section>
        </Grid>
    );
}

export default Loader;
