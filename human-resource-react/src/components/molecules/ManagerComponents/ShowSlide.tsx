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
    const [imageTimes, setImageTimes] = useState<Record<number, number>>({});
    const [currentImage, setCurrentImage] = useState<number | undefined>(undefined);
    const [startTime, setStartTime] = useState(Date.now());
    const [loading, setLoading] = useState(true);
    const dispatch: HumanResources = useDispatch();
    const { slideId: slideIdParam, userName: userNameParam } = useParams();
    const slideId = Number(slideIdParam) || 0;
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
        dispatch(fetchGetSlideById(Number(slideId))).unwrap().then((slide) => {
            setSlide(slide);
            setLoading(false);
        }).catch((error) => {
            console.error('Error fetching slide:', error);
            setLoading(false);
        });
    }, [dispatch, slideId]);

    const NextArrow = (props: any) => {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{
                    ...style,
                    display: 'block',
                    background: 'rgba(0, 0, 0, 0.5)', // Yarı transparan yeşil arka plan
                    right: '10px',
                    zIndex: 1,
                }}
                onClick={onClick}
            />
        );
    };

    const PrevArrow = (props: any) => {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{
                    ...style,
                    display: 'block',
                    background: 'rgba(0, 0, 0, 0.5)', // Yarı transparan yeşil arka plan
                    left: '10px',
                    zIndex: 1,
                }}
                onClick={onClick}
            />
        );
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        // nextArrow: <NextArrow />,
        // prevArrow: <PrevArrow />,

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
