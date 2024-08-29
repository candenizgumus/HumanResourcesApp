import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCreateUserStories, fetchGetUserStories, IUserStoryResponse } from '../../../store/feature/userStorySlice';
import { RootState } from '../../../store';
import type { HumanResources } from '../../../store';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';
import { ISlide } from '../../../store/feature/slideSlice';
import RestApis from "../../../config/RestApis";
import ThemeElement from '../../atoms/ThemeElement';
import {
    Button,
    Grid,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Autocomplete,
    Box,
    Snackbar,
} from "@mui/material";
import RestApi from "../../../config/RestApis";
const CustomCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxWidth: 345,
    margin: 'auto',
}));

const CustomCardMedia = styled(CardMedia)(({ theme }) => ({
    height: 200,
}));

const CardContentWrapper = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
});

const CustomTypography = styled(Typography)(({ theme }) => ({
    textAlign: 'center',
    color: theme.palette.text.primary,
}));

const SlideCard = (props: ISlide) => {
    const navigate = useNavigate();
    const [openGetLinkModal, setOpenGetLinkModal] = useState(false);
    const [userName, setUserName] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleClick = () => {
        navigate(`/slides/${encodeURIComponent(props.id)}`);
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setOpenSnackbar(true)
        } catch (err) {
            console.error("Kopyalama başarısız:", err);
        }
    };

    const handleGetLink = () => {
        copyToClipboard(RestApi.baseUrl + `/slides/${encodeURIComponent(props.id)}/${encodeURIComponent(userName)}`)
        setOpenGetLinkModal(false);
    };

    const handleCloseGetLinkModal = () => {
        setOpenGetLinkModal(false);
        setGeneratedLink('');
        setUserName('');
    };


    return (
        <ThemeElement children={
            <>
                <Grid item xs={12} sm={6} md={4}>
                    <Grid key={props.id} onClick={handleClick} sx={{
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.01)'
                        }
                    }}>
                        <CustomCard>
                            <img src={RestApis.staticUploads + props.mobileImageUrls[0]} />
                        </CustomCard>
                    </Grid>
                    <Button sx={{ textAlign: 'center', marginTop: '10px' }} variant="contained" color='primary' fullWidth onClick={() => setOpenGetLinkModal(true)}>Get Link</Button>
                </Grid>
                <Dialog open={openGetLinkModal} onClose={handleCloseGetLinkModal} fullWidth maxWidth='sm'>
                    <DialogTitle>Get Link</DialogTitle>
                    <DialogContent>
                        <Box mt={2}>
                            <Grid item mt={2}>
                                <TextField
                                    label="Name"
                                    name="name"
                                    value={userName}
                                    inputProps={{ maxLength: 20 }}
                                    onChange={e => setUserName(e.target.value)}
                                    required
                                    fullWidth
                                />
                            </Grid>

                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseGetLinkModal} color="error" variant="contained"
                            sx={{ marginRight: '17px', width: '150px' }}>
                            Cancel
                        </Button>
                        <Button onClick={handleGetLink} color="success" variant="contained" disabled={userName.length === 0}
                            sx={{ marginRight: '17px', width: '150px' }}>
                            Click to Copy
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar open={openSnackbar} autoHideDuration={6000} color='success' onClose={() => setOpenSnackbar(false)} message={"Link copied to clipboard"} />
            </>
        } />
    )
};

export default SlideCard;