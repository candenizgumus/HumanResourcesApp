import React, { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCreateUserStories, fetchGetUserStories, IUserStoryResponse } from '../../../store/feature/userStorySlice';
import { RootState } from '../../../store';
import type { HumanResources } from '../../../store';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';
import { ISlide } from '../../../store/feature/slideSlice';
import RestApis from "../../../config/RestApis";
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

const SlideCard = (props:ISlide) => {
    const navigate = useNavigate();
    const handleClick = () => {
        
    };

    return (
        <Grid item xs={12} sm={6} md={4} key={props.id} onClick={handleClick} sx={{
            cursor: 'pointer',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
                transform: 'scale(1.01)'
        }
        }}>
            <CustomCard>
                <img src={RestApis.staticUploads+props.imageUrls[0]} />
            </CustomCard>
        </Grid>
    );
};

export default SlideCard;