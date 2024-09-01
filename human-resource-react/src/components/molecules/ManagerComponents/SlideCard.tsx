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
    Typography
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
import {myBackgroundColour, myErrorColour, myLightColour} from "../../../util/MyColours";
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
        if(isMobile && props.open)
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

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: '10px', borderRadius: '5px', height: '100%', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)' }}>
            <Typography variant="subtitle1" sx={{ textAlign: 'center',display: displayExtras ? 'block' : 'none'}} >
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <CustomCard onClick={handleClick}>
                        <img src={RestApis.staticUploads + props.slide.desktopImageUrls[0]} alt="Slide" style={{ width: '100%', objectFit: 'cover'  }} />
                    </CustomCard>
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={4} sx={{ overflow: 'auto' }}>
                                <Typography sx={{ mb: 1.5, fontStyle: 'italic', fontSize: '12px' }} variant="body2">
                                    <strong>Id:</strong> {props.slide.id}
                                </Typography>
                                <Typography sx={{ mb: 1.5, fontStyle: 'italic', fontSize: '12px' }} variant="body2">
                                    <strong>City:</strong> {props.slide.city}
                                </Typography>
                                <Typography sx={{ mb: 1.5, fontStyle: 'italic', fontSize: '12px' }} variant="body2">
                                    <strong>District:</strong> {props.slide.district}
                                </Typography>
                            </Grid>
                            <Grid item xs={8} sx={{ overflow: 'auto' }}>
                                <Typography sx={{ mb: 1.5, fontStyle: 'italic', fontSize: '12px' }} variant="body2">
                                    <strong>N.hood:</strong> {props.slide.neighborhood}
                                </Typography>
                                <Typography sx={{ mb: 1.5, fontStyle: 'italic', fontSize: '12px' }} variant="body2">
                                    <strong>Projection:</strong> {props.slide.projection}
                                </Typography>
                                <Typography sx={{ mb: 1.5, fontStyle: 'italic', fontSize: '12px' }} variant="body2">
                                    <strong>Concept:</strong> {props.slide.concept}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ marginTop: '10px', justifyContent: 'flex-end' }}>
                            <Grid item xs={6}>
                                <Button fullWidth variant="contained" color="primary" sx={{ margin: '5px' }} startIcon={<ContentCopyIcon />} onClick={() => setOpenGetLinkModal(true)}>
                                    Get Link
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button fullWidth variant="contained" color="error" sx={{ margin: '5px' }} startIcon={<DeleteIcon />} onClick={handleDeleteSlide}>
                                    Delete
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>


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
