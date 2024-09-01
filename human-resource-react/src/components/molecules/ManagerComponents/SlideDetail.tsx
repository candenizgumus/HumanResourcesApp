import React, { useEffect, useRef, useState } from 'react';
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
import { styled } from "@mui/material/styles";
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { NavBar } from '../PreAuthorizedPageComponents/NavBar';
import FooterElement from '../PreAuthorizedPageComponents/FooterElement';
import SliderMessage from '../../atoms/SliderMessage';
import EncoderDecoder from "../../../util/EncoderDecoder";
import Swal from "sweetalert2";
import {myErrorColour, myLightColour} from "../../../util/MyColours";

const Root = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.myBackgroundColour.main,
}));

const Body = styled('main')(({ theme }) => ({
    flex: '1',
    width: '100%',
    minHeight: '100vh',
    marginTop: theme.spacing(1),
}));

const Footer = styled('footer')(({ theme }) => ({
    padding: theme.spacing(0),
}));

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
    const companyId = companyIdParam || ''; // Default value to avoid undefined
    const slideId = slideIdParam || ''; // Default value to avoid undefined
    const [slide, setSlide] = useState<ISlide | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const handleScroll = () => {
        const offset = window.scrollY;
        setScrolled(offset > 0);
    };
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        dispatch(fetchGetIp()).unwrap().then((ip) => setUserIP(ip));
    }, [dispatch]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.matchMedia('(max-width: 600px)').matches);
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

                    try {
                        const slideIdDecoded = EncoderDecoder.decode(slideId);
                        const companyIdDecoded = EncoderDecoder.decode(companyId);
                        const userNameDecoded = EncoderDecoder.decodeString(userName);

                        console.log('Sending time data:', { updatedImageTimes, userIP, userName, slideId });
                        const response = await dispatch(fetchStoreTimeData({ imageTimes: updatedImageTimes, userIP, userName:userNameDecoded, slideId: slideIdDecoded, companyId: companyIdDecoded })).unwrap();
                        console.log('Time data sent successfully:', response);
                        // Devam eden işlemler
                    } catch (error) {
                        Swal.fire({
                            title: "Error!",
                            text: "There is error occured.",
                            icon: "error",
                            confirmButtonText: "OK",
                            confirmButtonColor: myLightColour,
                        });

                    }

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
        const decodedSlideId = EncoderDecoder.decode(slideId);
        dispatch(fetchGetSlideById(decodedSlideId)).unwrap().then((slide) => {
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

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: (current: number) => handleImageChange(current),
        nextArrow: <CustomNextArrow onClick={() => { }} />, // Placeholder onClick handler
        prevArrow: <CustomPrevArrow onClick={() => { }} />, // Placeholder onClick handler
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
            <Root>
                <CssBaseline />
                {(!scrolled && isMobile) ? null : <NavBar />}
                <Body >
                    <Container maxWidth="lg" sx={{ bgcolor: 'myBackgroundColour.main' }}>
                        <Box sx={{ boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)' }}>
                            {isMobile ? (<>
                                <SliderMessage message="You can slide to view other pages!" position={true} />
                                <SliderMessage message="Scroll down to use the navigation buttons below the slider!" position={false} />
                                <Box sx={{
                                    position: 'relative', marginBottom: '70px', '.slick-dots': { bottom: '-60px' }, '& .slick-dots li button': {
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
                                <Box sx={{position: 'relative', marginTop: '3%', '.slick-dots': { bottom: '-60px' }, '& .slick-dots li button': {
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
                                }}>
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
                </Body>
                <Footer>
                    <FooterElement />
                </Footer>
            </Root>
        </ThemeElement>
    );
}

export default UserStoryDetailPage;
