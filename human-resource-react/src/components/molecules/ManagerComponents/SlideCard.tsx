import React, { useState, useEffect } from 'react';
import {
    Button,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Snackbar,
    Box,
    Typography,
    Tooltip
} from "@mui/material";
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { fetchDeleteSlide, fetchGetAllSlides, ISlide } from '../../../store/feature/slideSlice';
import RestApis from "../../../config/RestApis";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { HumanResources, useAppSelector } from "../../../store";
import { changePageState, fetchFindCompanyNameAndManagerNameOfUser } from "../../../store/feature/authSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { myBackgroundColour, myErrorColour, myLightColour } from "../../../util/MyColours";
import { fetchDeleteTask, fetchGetTasks } from "../../../store/feature/TaskSlice";
import { ActivateIcon } from '../../atoms/icons';
import EncoderDecoder from "../../../util/EncoderDecoder";



const CustomCard = styled(Card)(({ theme }) => ({
    maxHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',

    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out',
    marginTop: '10px',
    '&:hover': {
        transform: 'scale(1.01)'
    }

}));

const SlideCard = (props: { slide: ISlide, open: boolean, fetchMethod: () => void }) => {
    const navigate = useNavigate();
    const [openGetLinkModal, setOpenGetLinkModal] = useState(false);
    const [userName, setUserName] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const user = useAppSelector(state => state.auth.user);
    const token = useAppSelector(state => state.auth.token);
    const dispatch = useDispatch<HumanResources>();
    const [companyName, setCompanyName] = useState('');
    const [message, setMessage] = useState('');
    const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 768px)').matches);
    const [displayExtras, setDisplayExtras] = useState(isMobile);
    //For Tooltip
    const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [tooltipText, setTooltipText] = useState<string | null>(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.matchMedia('(max-width: 768px)').matches);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const handleClick = () => {
        dispatch(changePageState(`Slide:${encodeURIComponent(props.slide.id)}`))
        //navigate(`/slides/${encodeURIComponent(props.slide.id)}`);
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(String(text));
            setOpenSnackbar(true);
        } catch (err) {
            console.error("Copy failed:", err);
        }
    };

    useEffect(() => {
        if (isMobile && props.open)
            setDisplayExtras(false);
        else
            setDisplayExtras(true);
    }, [isMobile, props.open]);

    const handleGetLink = () => {

        const link = `${RestApis.baseUrl}/slides/${encodeURIComponent(EncoderDecoder.encode(props.slide.id))}/${encodeURIComponent(EncoderDecoder.encode(user.companyId))}/${encodeURIComponent(EncoderDecoder.encodeString(userName))}`;
        setMessage("Link copied to clipboard")
        copyToClipboard(link);
        setOpenGetLinkModal(false);
    };

    const handleGetId = () => {
        const id = props.slide.id;
        setMessage("ID copied to clipboard")
        copyToClipboard(String(id));
    };

    const handleDeleteSlide = async () => {

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: myLightColour,
            cancelButtonColor: myErrorColour,
            confirmButtonText: "Yes, delete it!"
        });
        if (result.isConfirmed) {
            dispatch(fetchDeleteSlide({ token: token, slideId: props.slide.id })).then(() => {
                props.fetchMethod();
            })
        }



    }

    

    const handleMouseMove = (event: React.MouseEvent<HTMLElement>, text: string) => {
        setCursorPosition({ x: event.clientX, y: event.clientY });
        setTooltipText(text);
    };

    const handleMouseLeave = () => {
        setTooltipText(null);
    };

    const textItems = [
        { label: 'Id', value: props.slide.id.toString() },
        { label: 'City', value: props.slide.city },
        { label: 'District', value: props.slide.district },
        { label: 'N.hood', value: props.slide.neighborhood },
        { label: 'Projection', value: props.slide.projection },
        { label: 'Concept', value: props.slide.concept },
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: '10px', borderRadius: '5px', height: '100%', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)' }}>
            <Grid container spacing={2} >
                <Grid item xs={12}>
                    <CustomCard onClick={handleClick}>
                        <img src={RestApis.staticUploads + props.slide.desktopImageUrls[0]} alt="Slide" style={{ width: '100%', objectFit: 'cover' }} />
                    </CustomCard>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ marginTop: '10px', justifyContent: 'flex-end' }}>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        {textItems.slice(0, 3).map((item, index) => (
                            <Grid item xs={6} sx={{ overflow: 'unset' }} key={index}>
                                <Typography
                                    sx={{
                                        mb: 1.5,
                                        fontStyle: 'italic',
                                        fontSize: '12px',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                    variant="body2"
                                    onMouseMove={(e) => handleMouseMove(e, item.value)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <strong>{item.label}:</strong> {item.value}
                                </Typography>
                            </Grid>
                        ))}
                        {textItems.slice(3).map((item, index) => (
                            <Grid item xs={6} sx={{ overflow: 'auto' }} key={index + 3}>
                                <Typography
                                    sx={{
                                        mb: 1.5,
                                        fontStyle: 'italic',
                                        fontSize: '12px',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                    variant="body2"
                                    onMouseMove={(e) => handleMouseMove(e, item.value)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <strong>{item.label}:</strong> {item.value}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                    {tooltipText && (
                        <Box
                            sx={{
                                position: 'fixed',
                                top: cursorPosition.y + 10,
                                left: cursorPosition.x + 10,
                                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                                color: 'white',
                                padding: '5px 10px',
                                borderRadius: '4px',
                                zIndex: 9999,
                                pointerEvents: 'none',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {tooltipText}
                        </Box>
                    )}

                    <Grid container spacing={2} sx={{ marginTop: '10px', justifyContent: 'flex-end' }}>
                        <Grid item xs={6}>
                            <Button fullWidth variant="contained" color="primary" startIcon={<ContentCopyIcon />} onClick={() => setOpenGetLinkModal(true)}>
                                Get Link
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button fullWidth variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteSlide}>
                                Delete
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>


            {/* Dialog and Snackbar components here */}
            <Dialog open={openGetLinkModal} onClose={() => setOpenGetLinkModal(false)} fullWidth maxWidth='sm'>
                <DialogTitle>Get Link</DialogTitle>
                <DialogContent>
                    <TextField
                        sx={{ marginTop: '10px' }}
                        label="Name"
                        name="name"
                        value={userName}
                        inputProps={{ maxLength: 20 }}
                        onChange={e => setUserName(e.target.value)}
                        required
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenGetLinkModal(false)} color="error" variant="contained">Cancel</Button>
                    <Button onClick={handleGetLink} color="success" variant="contained" disabled={userName.length === 0}>Click to Copy Link</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={() => setOpenSnackbar(false)}
                message={
                    <Typography
                        style={{
                            color: "white",
                            fontWeight: "bold",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <ActivateIcon style={{ marginRight: 8 }} />
                        {message}
                    </Typography>
                }
                ContentProps={{
                    style: { backgroundColor: "#4caf50" }, // Success color
                }}
            />
        </Box>
    );
};

export default SlideCard;
