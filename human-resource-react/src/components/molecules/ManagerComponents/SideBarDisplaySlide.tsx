import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, CssBaseline, Box, CircularProgress, IconButton } from '@mui/material';
import Slider from 'react-slick';
import ThemeElement from '../../atoms/ThemeElement';
import RestApis from '../../../config/RestApis';
import { fetchGetIp, fetchGetSlideById, fetchStoreTimeData, ISlide } from '../../../store/feature/slideSlice';
import { HumanResources } from '../../../store';
import { useDispatch } from 'react-redux';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import SliderMessage from '../../atoms/SliderMessage';

function ShowSlide(props: { slideId: number}) {
    const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 768px)').matches);
    const [imageTimes, setImageTimes] = useState<Record<number, number>>({});
    const [currentImage, setCurrentImage] = useState<number | undefined>(undefined);
    const [startTime, setStartTime] = useState(Date.now());
    const [loading, setLoading] = useState(true);
    const dispatch: HumanResources = useDispatch();
    const [slide, setSlide] = useState<ISlide | null>(null);


    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.matchMedia('(max-width: 768px)').matches);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        dispatch(fetchGetSlideById(props.slideId)).unwrap().then((slide) => {
            setSlide(slide);
            setLoading(false);
        }).catch((error) => {
            console.error('Error fetching slide:', error);
            setLoading(false);
        });
    }, [dispatch, props.slideId]);

    const CustomNextArrow = ({ onClick }: { onClick: () => void }) => {
        return (
            <IconButton
                onClick={onClick}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    right: '-50px', // Adjust this value to move the arrow further away from the edge
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background
                    color: 'white',
                    display: isMobile ? 'none' : '',
                    zIndex: 1,
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                }}
            >
                <ArrowForward />
            </IconButton>
        );
    };

    // Custom Prev Arrow
    const CustomPrevArrow = ({ onClick }: { onClick: () => void }) => {
        return (
            <IconButton
                onClick={onClick}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '-50px', // Adjust this value to move the arrow further away from the edge
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background
                    color: 'white',
                    zIndex: 1,
                    display: isMobile ? 'none' : '',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                }}
            >
                <ArrowBack />
            </IconButton>
        );
    };

    useEffect(() => {
        // Add numbers to the dots after component mounts
        const slickDots = document.querySelectorAll('.slick-dots li');
        slickDots.forEach((dot, index) => {
            const numberSpan = document.createElement('span');
            numberSpan.textContent = (index + 1).toString(); // Add numbers 1, 2, 3, etc.
            numberSpan.classList.add('dot-number'); // Add a class for custom styling
            dot.appendChild(numberSpan); // Append the number to each dot
        });
    }, [slide]);
    
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <CustomNextArrow onClick={() => {}} />, // Placeholder onClick handler
        prevArrow: <CustomPrevArrow onClick={() => {}} />, // Placeholder onClick handler
    };

    if (loading) {
        return (
            <ThemeElement>
                <Container>
                    <CssBaseline />
                    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                        <CircularProgress />
                    </Box>
                </Container>
            </ThemeElement>
        );
    }

    if (!slide) {
        return (
            <ThemeElement>
                <Container>
                    <CssBaseline />
                    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                        <div>Slide not found</div>
                    </Box>
                </Container>
            </ThemeElement>
        );
    }

    return (
        <ThemeElement>
                    <Container maxWidth="lg">
                        <CssBaseline />
                        <Box sx={{ boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)' }}>
                            {isMobile ? (<>
                                <SliderMessage message="You can slide to view other pages!" position={true} color={false} margin={90} />
                                <SliderMessage message="Scroll down to use the navigation buttons below the slider!" position={false} color={false} margin={20} />
                                <Box 
                                    sx={{
                                        position: 'relative', 
                                        marginBottom: '70px', 
                                        '.slick-dots': { bottom: '-60px' }, 
                                        '& .slick-dots li button': {
                                        borderRadius: '50%', // Make dots circular
                                        backgroundColor: 'black', // Default dot color
                                        opacity: 0.5,
                                        '&:before': {
                                            content: '""',
                                            display: 'block',
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '50%',
                                            backgroundColor: 'black', // Dot color
                                        },
                                    },
                                    '& .slick-dots li.slick-active button:before': {
                                        backgroundColor: 'red', // Color of the active dot
                                        opacity: 1,
                                    },
                                    // Additional styles for dot numbers
                                    '& .slick-dots li .dot-number': {
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)', // Center the number
                                        color: 'white', // Number color
                                        fontSize: '12px', // Adjust font size
                                        pointerEvents: 'none', // Ensure numbers don't block clicks
                                        zIndex: 0, // Ensure number is below the button
                                    },
                                }}>
                                    {slide.mobileImageUrls.length > 0 ? (
                                        <Slider {...sliderSettings}>
                                            {slide.mobileImageUrls.map((image: string, index: number) => (
                                                <img
                                                    key={index}
                                                    src={RestApis.staticUploads + image}
                                                    alt={`Slide ${index + 1}`}
                                                />
                                            ))}
                                        </Slider>
                                    ) : (
                                        <div>No images uploaded</div>
                                    )}
                                </Box></>
                            ) : (
                                <Box
                                    sx={{
                                        position: 'relative',
                                        marginTop: '3%',
                                        '.slick-dots': { bottom: '-60px' },
                                        '& .slick-dots li button': {
                                            borderRadius: '50%', // Make dots circular
                                            backgroundColor: 'black', // Default dot color
                                            opacity: 0.5,
                                            '&:before': {
                                                content: '""',
                                                display: 'block',
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: '50%',
                                                backgroundColor: 'black', // Dot color
                                            },
                                        },
                                        '& .slick-dots li.slick-active button:before': {
                                            backgroundColor: 'red', // Color of the active dot
                                            opacity: 1,
                                        },
                                        // Additional styles for dot numbers
                                        '& .slick-dots li .dot-number': {
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)', // Center the number
                                            color: 'white', // Number color
                                            fontSize: '12px', // Adjust font size
                                            pointerEvents: 'none', // Ensure numbers don't block clicks
                                            zIndex: 0, // Ensure number is below the button
                                        },
                                    }}
                                >
                                    {slide.desktopImageUrls.length > 0 ? (
                                        <Slider {...sliderSettings}>
                                            {slide.desktopImageUrls.map((image: string, index: number) => (
                                                <img
                                                    key={index}
                                                    src={RestApis.staticUploads + image}
                                                    alt={`Slide ${index + 1}`}
                                                />
                                            ))}
                                        </Slider>
                                    ) : (
                                        <div>No images uploaded</div>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </Container>
        </ThemeElement>
    );
}

export default ShowSlide;
