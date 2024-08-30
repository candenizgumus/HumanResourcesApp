import React, { useState } from 'react';
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Snackbar, Box } from "@mui/material";
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { ISlide } from '../../../store/feature/slideSlice';
import RestApis from "../../../config/RestApis";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
const CustomCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',

        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out',
        marginTop:'10px',
        '&:hover': {
            transform: 'scale(1.01)'
        }

}));

const SlideCard = (props: ISlide) => {
    const navigate = useNavigate();
    const [openGetLinkModal, setOpenGetLinkModal] = useState(false);
    const [userName, setUserName] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleClick = () => {
        navigate(`/slides/${encodeURIComponent(props.id)}`);
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setOpenSnackbar(true);
        } catch (err) {
            console.error("Copy failed:", err);
        }
    };

    const handleGetLink = () => {
        const link = `${RestApis.baseUrl}/slides/${encodeURIComponent(props.companyId)}/${encodeURIComponent(props.companyName)}/${encodeURIComponent(props.id)}/${encodeURIComponent(userName)}`;
        copyToClipboard(link);
        setOpenGetLinkModal(false);
    };

    const handleDeleteSlide = () => {
        
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column',padding: '10px', borderRadius: '5px', height: '100%', boxShadow:'0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)'}}>
            <CustomCard onClick={handleClick}>
                <img src={RestApis.staticUploads + props.desktopImageUrls[0]} alt="Slide" style={{ width: '100%', objectFit: 'cover' }} />
            </CustomCard>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <Button variant="contained" color="success" sx={{
                        flex: 1,
                        margin: '5px',
                        maxWidth: { xs: '100%', sm: '150px' },
                    }} startIcon={<ContentCopyIcon />} onClick={() => setOpenGetLinkModal(true)}>
                    Get Link
                </Button>
                <Button variant="contained" color="error" sx={{
                        flex: 1,
                        margin: '5px',
                        maxWidth: { xs: '100%', sm: '150px' },
                    }} startIcon={<DeleteIcon />} onClick={handleDeleteSlide}>
                    Delete
                </Button>
            </Box>

            {/* Dialog and Snackbar components here */}
            <Dialog open={openGetLinkModal} onClose={() => setOpenGetLinkModal(false)} fullWidth maxWidth='sm'>
                <DialogTitle>Get Link</DialogTitle>
                <DialogContent>
                    <TextField
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
                    <Button onClick={handleGetLink} color="success" variant="contained" disabled={userName.length === 0}>Click to Copy</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)} message={"Link copied to clipboard"} />
        </Box>
    );
};

export default SlideCard;
