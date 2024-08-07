import React from 'react';
import { styled } from '@mui/material/styles';

const CardContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2),
    height: '100px', // Adjust the height as needed
    width: '150px', // Set a fixed width to ensure all logos have the same width
}));

const LogoImage = styled('img')(({ theme }) => ({
    maxHeight: '100%', // Ensure the logo fits within the height of the container
    maxWidth: '100%',  // Ensure the logo fits within the width of the container
    objectFit: 'contain',
}));

interface LogoCardProps {
    logoSrc: string;
    altText: string;
}

const LogoCard: React.FC<LogoCardProps> = ({ logoSrc, altText }) => {
    return (
        <CardContainer>
            <LogoImage src={logoSrc} alt={altText} />
        </CardContainer>
    );
};

export default LogoCard;
