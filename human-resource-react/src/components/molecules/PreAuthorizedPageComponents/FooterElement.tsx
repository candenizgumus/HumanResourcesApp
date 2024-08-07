import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';

const FooterElement = () => {
    return (
        <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6}}>
            <Container maxWidth="lg">
                <Typography variant="h6" align="center" gutterBottom>
                    KolayIK
                </Typography>
                <Typography variant="subtitle1" align="center" component="p">
                    Simplifying HR Management
                </Typography>
                <Typography variant="body2" color="inherit" align="center">
                    {'© '}
                    <Link color="inherit" href="https://kolayik.com/">
                        KolayIK
                    </Link>{' '}
                    {new Date().getFullYear()}
                </Typography>
            </Container>
        </Box>
    );
};

export default FooterElement;