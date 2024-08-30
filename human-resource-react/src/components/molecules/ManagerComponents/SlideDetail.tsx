import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, CssBaseline, Box, CircularProgress } from '@mui/material';
import Slider from 'react-slick';
import ThemeElement from '../../atoms/ThemeElement';
import RestApis from '../../../config/RestApis';
import { fetchGetIp, fetchGetSlideById, fetchStoreTimeData, ISlide } from '../../../store/feature/slideSlice';
import { HumanResources } from '../../../store';
import { useDispatch } from 'react-redux';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function UserStoryDetailPage() {
    const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 768px)').matches);
    const [userIP, setUserIP] = useState('');
    const [imageTimes, setImageTimes] = useState<Record<number, number>>({});
    const [currentImage, setCurrentImage] = useState<number | undefined>(0);
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
            try {
                console.log('Sending time data:', { imageTimes, userIP, userName, slideId });
                const response = await dispatch(fetchStoreTimeData({ imageTimes, userIP, userName, slideId })).unwrap();
                console.log('Time data sent successfully:', response);
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

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: (current: number) => handleImageChange(current),
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
