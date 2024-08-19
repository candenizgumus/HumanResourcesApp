import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';
import ThemeElement from '../../atoms/ThemeElement';

const FooterElement = () => {
    return (
        <ThemeElement children={
            <Box color={'myBackgroundColour.main'} sx={{ bgcolor: 'primary.main', py: 6 }}>
                <Container maxWidth="lg">
                    <Typography variant="h6" align="center" gutterBottom >
                        Easy HR
                    </Typography>
                    <Typography variant="subtitle1" align="center" component="p">
                        Simplifying HR Management
                    </Typography>
                    <Typography variant="body2" color="inherit" align="center">
                        {'© '}
                        <Link color="inherit" href="https://github.com/candenizgumus/HumanResourcesApp.git">
                            Easy HR
                        </Link>{' '}
                        {new Date().getFullYear()}
                    </Typography>
                </Container>
            </Box>
        } />
    );
};

export default FooterElement;