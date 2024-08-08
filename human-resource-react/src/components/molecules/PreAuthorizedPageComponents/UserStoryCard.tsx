import React, { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { IUserStory } from '../../../models/IUserStory';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCreateUserStories, fetchGetUserStories, IUserStoryResponse } from '../../../store/feature/userStorySlice';
import { RootState } from '../../../store';
import type { HumanResources } from '../../../store';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';

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

const UserStoryCard = (props:IUserStoryResponse) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/user-stories/${encodeURIComponent(props.companyName)}`, {
            state: {
                id:props.id,
                managerName:props.managerName,
                companyName:props.companyName,
                title: props.title,
                shortDescription : props.shortDescription,
                longDescription :props.longDescription,
                photo :props.photo,
                sector :props.sector,
                numberOfEmployees : props.numberOfEmployees,
                logo : props.logo,
                country : props.country
            }
        });
    };

    return (
        <Grid item xs={12} sm={6} md={4} key={props.companyName} onClick={handleClick} sx={{
            cursor: 'pointer',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
                transform: 'scale(1.01)'
        }
        }}>
            <CustomCard>
                <CustomCardMedia image={props.photo} title={props.shortDescription} />
                <CardContentWrapper>
                    <CardContent>
                        <CustomTypography variant="h6">
                            {props.companyName}
                        </CustomTypography>
                        <CustomTypography variant="subtitle1" color="textSecondary">
                            {props.managerName}
                        </CustomTypography>
                        <CustomTypography variant="subtitle2" color="textSecondary">
                            {props.title}
                        </CustomTypography>
                        <Divider sx={{
                            margin: '16px 0',
                            borderBottomWidth: 2,
                            borderColor: theme => theme.palette.primary.main
                        }} />
                        <CustomTypography variant="body2" color="textSecondary">
                            {props.shortDescription}
                        </CustomTypography>
                    </CardContent>
                </CardContentWrapper>
            </CustomCard>
        </Grid>
    );
};

export default UserStoryCard;
