import React, { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { IUserStory } from '../../models/IUserStory';
import { useDispatch, useSelector } from 'react-redux';
import {fetchCreateUserStories, IUserStoryResponse} from '../../store/feature/userStorySlice';
import { RootState } from '../../store';
import type { HumanResources } from '../../store';

const CustomCard = styled(Card)(({ theme }) => ({
    maxWidth: 345,
    margin: 'auto',
}));

const CustomCardMedia = styled(CardMedia)(({ theme }) => ({
    height: 140,

}));

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
        <>
            {userStories.map((userStory) => (
                <CustomCard key={userStory.id}>
                    <CustomCardMedia image={userStory.photo} title={userStory.commentText} />
                    <CardContent>
                        <CustomTypography variant="body2" color="textSecondary" >
                            {userStory.commentText}
                        </CustomTypography>
                    </CardContent>
                </CustomCard>
            ))}

        </>
    );
};

export default UserStoryCard;


