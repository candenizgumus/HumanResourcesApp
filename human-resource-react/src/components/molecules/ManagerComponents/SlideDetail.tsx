import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Container, CssBaseline, Box, CircularProgress } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import ThemeElement from '../../atoms/ThemeElement';
import RestApis from '../../../config/RestApis';
import { fetchGetIp, fetchGetSlideById, fetchStoreTimeData, ISlide } from '../../../store/feature/slideSlice';
import { HumanResources, useAppSelector } from '../../../store';
import { useDispatch } from 'react-redux';

function UserStoryDetailPage() {
    const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 768px)').matches);
    const [userIP, setUserIP] = useState('');
    const [imageTimes, setImageTimes] = useState<Record<number, number>>({});
    const [currentImage, setCurrentImage] = useState<number | null>(null);
    const [startTime, setStartTime] = useState(Date.now());
    const [loading, setLoading] = useState(true);
    const dispatch: HumanResources = useDispatch();
    const { slideId: slideIdParam, userName: userNameParam } = useParams();
    const userName = userNameParam || ''; // Default value to avoid undefined
    const slideId = Number(slideIdParam) || 0;
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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleImageChange = (now?: number, previous?: number) => {
        const endTime = Date.now();
        const timeSpent = (endTime - startTime) / 1000; // in seconds

        if (currentImage !== null && previous !== undefined) {
            setImageTimes((prevTimes) => ({
                ...prevTimes,
                [previous]: (prevTimes[previous] || 0) + timeSpent,
            }));
        }
        setCurrentImage(now !== undefined ? now : null);
        setStartTime(Date.now());
    };

    useEffect(() => {
        const sendTimeData = async () => {
            try {
                await dispatch(fetchStoreTimeData({ imageTimes, userIP, userName, slideId })).unwrap();
            } catch (error) {
                console.error('Error sending time data:', error);
            }
        };

        window.addEventListener('beforeunload', sendTimeData);

        return () => {
            window.removeEventListener('beforeunload', sendTimeData);
        };
    }, [imageTimes, userIP, dispatch, userName]);

    useEffect(() => {
        dispatch(fetchGetSlideById(Number(slideId))).unwrap().then((slide) => {
            setSlide(slide);
            setLoading(false);
        }).catch((error) => {
            console.error('Error fetching slide:', error);
            setLoading(false);
        });
    }, [dispatch, slideId]);

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
                        <Box sx={{ width: 'auto', minWidth: '545px', margin: 'auto' }}>
                            {slide.mobileImageUrls.length > 0 ? (
                                <Carousel onChange={handleImageChange} autoPlay={false}>
                                    {slide.mobileImageUrls.map((image: string, index: number) => (
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
                        <Box sx={{ width: 'auto', margin: 'auto' }}>
                            {slide.desktopImageUrls.length > 0 ? (
                                <Carousel onChange={handleImageChange} autoPlay={false}>
                                    {slide.desktopImageUrls.map((image: string, index: number) => (
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
            </Container>
        </ThemeElement>
    );
}

export default UserStoryDetailPage;
