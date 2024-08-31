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

function UserStoryDetailPage() {
    const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 768px)').matches);
    const [userIP, setUserIP] = useState('');
    const [imageTimes, setImageTimes] = useState<Record<number, number>>({});
    const [currentImage, setCurrentImage] = useState<number | undefined>(0);
    const [startTime, setStartTime] = useState(Date.now());
    const [loading, setLoading] = useState(true);
    const dispatch: HumanResources = useDispatch();
    const { slideId: slideIdParam, userName: userNameParam, companyId: companyIdParam } = useParams();
    const userName = userNameParam || ''; // Default value to avoid undefined
    const companyId = Number(companyIdParam) || 0; // Default value to avoid undefined
    const slideId = slideIdParam || '';
    const [slide, setSlide] = useState<ISlide | null>(null);

    useEffect(() => {
        dispatch(fetchGetIp()).unwrap().then((ip) => setUserIP(ip));
    }, [dispatch]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.matchMedia('(max-width: 768px)').matches);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleImageChange = (now?: number) => {
        const endTime = Date.now();
        const timeSpent = (endTime - startTime) / 1000; // Calculate time spent in seconds

        console.log(`Image transition from ${currentImage} to ${now}`);
        console.log(`Time spent on image ${currentImage}: ${timeSpent} seconds`);

        if (currentImage !== undefined) {
            setImageTimes((prevTimes) => {
                const updatedTimes = {
                    ...prevTimes,
                    [currentImage]: (prevTimes[currentImage] || 0) + timeSpent,
                };
                console.log('Updated image times:', updatedTimes);
                return updatedTimes;
            });
        }

        setCurrentImage(now);
        setStartTime(Date.now());
    };

    useEffect(() => {
        const sendTimeData = async () => {
            if (currentImage !== undefined) {
                const endTime = Date.now();
                const timeSpent = (endTime - startTime) / 1000;

                const updatedImageTimes = {
                    ...imageTimes,
                    [currentImage]: (imageTimes[currentImage] || 0) + timeSpent,
                };

                try {
                    console.log('Sending time data:', { updatedImageTimes, userIP, userName, slideId });
                    const response = await dispatch(fetchStoreTimeData({ imageTimes: updatedImageTimes, userIP, userName, slideId, companyId })).unwrap();
                    console.log('Time data sent successfully:', response);
                } catch (error) {
                    console.error('Error sending time data:', error);
                }
            }
        };

        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'hidden') {
                await sendTimeData();
            }
        };

        const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
            e.preventDefault();
            await sendTimeData();
            e.returnValue = '';
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [imageTimes, userIP, dispatch, userName, currentImage, startTime, slideId]);




    useEffect(() => {
        dispatch(fetchGetSlideById(slideId)).unwrap().then((slide) => {
            setSlide(slide);
            setLoading(false);
        }).catch((error) => {
            console.error('Error fetching slide:', error);
            setLoading(false);
        });
    }, [dispatch, slideId]);

    const CustomNextArrow = ({ onClick }: { onClick: () => void }) => {
        return (
            <IconButton
                onClick={onClick}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    right: '10px', // Adjust this value to move the arrow further away from the edge
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background
                    color: 'white',
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
                    left: '10px', // Adjust this value to move the arrow further away from the edge
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background
                    color: 'white',
                    zIndex: 1,
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                }}
            >
                <ArrowBack />
            </IconButton>
        );
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: (current: number) => handleImageChange(current),
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
            <Container>
                <CssBaseline />
                <Box>
                    {isMobile ? (
                        <Box>
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
                        </Box>
                    ) : (
                        <Box>
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

export default UserStoryDetailPage;
