import React, { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { IUserStory } from '../../models/IUserStory';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCreateUserStories, IUserStoryResponse } from '../../store/feature/userStorySlice';
import { RootState } from '../../store';
import type { HumanResources } from '../../store';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

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

const UserStoryCard = () => {
    const dispatch: HumanResources = useDispatch();
    const userStories = useSelector((state: RootState) => state.userStory.storyList) as IUserStoryResponse[];

    useEffect(() => {
        dispatch(fetchCreateUserStories());
    }, [dispatch]);

    return (
        <Grid container spacing={4}>
            {userStories.map((userStory) => (
                <Grid item xs={12} sm={6} md={4} key={userStory.id}>
                    <CustomCard>
                        <CustomCardMedia image={userStory.photo} title={userStory.commentText} />
                        <CardContentWrapper>
                            <CardContent>
                                <CustomTypography variant="h6">
                                    {userStory.companyName}
                                </CustomTypography>
                                <CustomTypography variant="subtitle1" color="textSecondary">
                                    {userStory.managerName}
                                </CustomTypography>
                                <CustomTypography variant="subtitle2" color="textSecondary">
                                    {userStory.title}
                                </CustomTypography>
                                <Divider sx={{ 
                                        margin: '16px 0', 
                                        borderBottomWidth: 2, 
                                        borderColor: theme => theme.palette.primary.main 
                                    }} />
                                <CustomTypography variant="body2" color="textSecondary">
                                    {userStory.commentText}
                                </CustomTypography>
                            </CardContent>
                        </CardContentWrapper>
                    </CustomCard>
                </Grid>
            ))}
        </Grid>
    );
};

export default UserStoryCard;
