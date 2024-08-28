import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
    Typography,
    Container,
    CssBaseline,
    Box,
    Grid,
    Paper,
} from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import { styled } from '@mui/material/styles';
import ThemeElement from '../../atoms/ThemeElement'
import RestApis from "../../../config/RestApis";

function UserStoryDetailPage() {
    const location = useLocation();
    const slide = location.state || {};
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 768px)").matches);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.matchMedia("(max-width: 768px)").matches);
        };

        // Add event listener to track window resize
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);


    return (
        <ThemeElement>
            {/* Example of conditional rendering based on isMobile */}
            <Container>
                <CssBaseline />
                <Box>
                    {isMobile ? (
                        <Box sx={{ maxWidth: 'auto', margin: 'auto' }}>
                        {slide.mobileImages.length > 0 ? (
                            <Carousel>
                                {slide.mobileImages.map((image: string, index: number) => (
                                    <img
                                        key={index}
                                        src={RestApis.staticUploads + image}
                                        alt={`Slide ${index + 1}`}
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                ))}
                            </Carousel>
                        ) : (
                            <div>No images uploaded</div>
                        )}
                    </Box>
                    ) : (
                        <Box sx={{ maxWidth: 'auto', margin: 'auto' }}>
                            {slide.desktopImages.length > 0 ? (
                                <Carousel>
                                    {slide.desktopImages.map((image: string, index: number) => (
                                        <img
                                            key={index}
                                            src={RestApis.staticUploads + image}
                                            alt={`Slide ${index + 1}`}
                                            style={{ width: '100%', height: 'auto' }}
                                        />
                                    ))}
                                </Carousel>
                            ) : (
                                <div>No images uploaded</div>
                            )}
                        </Box>
                    )}
                </Box>
                {/* Other content can be added here */}
            </Container>
        </ThemeElement>
    );
}

export default UserStoryDetailPage;
