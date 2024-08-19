import React from 'react'
import { styled } from '@mui/material/styles';
import {
    Typography,
    Container,
    Box,
} from '@mui/material';
import WordPullUp from './WordPullUp';
import BoxReveal from './BoxReveal';
import ThemeElement from './ThemeElement';

const Header = styled('header')(({ theme }) => ({
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    width: '100%',
    padding: theme.spacing(3, 0),
}));

function HeaderElement(props: { headline: string, text: string }) {
    return (
        <ThemeElement children={
            <Header>
                <Container maxWidth="lg">
                    <Box py={5} sx={{ height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="h2" align="center" sx={{ color: 'myBackgroundColour.main' }} gutterBottom>
                            <WordPullUp words={props.headline} />
                        </Typography>
                        <Typography variant="body1" align="center" sx={{ color: 'myBackgroundColour.main' }} paragraph>
                            {props.text}
                        </Typography>

                    </Box>
                </Container>
            </Header>
        } />
    )
}

export default HeaderElement