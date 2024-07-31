import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import { IFeature } from "../../models/IFeature";
import { useNavigate } from "react-router-dom";

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
}));

const CardMediaStyled = styled(CardMedia)({
    height: 140,
});

export default function FeatureCard(props: IFeature) {
    const { name, shortDescription, iconPath } = props;
    const navigate = useNavigate();

    const handleEditClick = () => {
        navigate("/features");
    };

    return (
        <Grid item xs={12} sm={6} md={4}>
            <StyledCard onClick={handleEditClick}>
                <CardMedia
                    component="img"
                    image={`./images/${iconPath}`}
                    title={name}
                    style={{ width: 'auto', height: '64px', objectFit: 'contain' }}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {name}
                    </Typography>
                    <Typography>
                        {shortDescription}
                    </Typography>
                </CardContent>
            </StyledCard>
        </Grid>
    );
}
