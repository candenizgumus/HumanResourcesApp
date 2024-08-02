import {styled} from "@mui/material/styles";
import React, {useRef} from "react";
import { CssBaseline} from "@mui/material";
import {NavBar} from "../components/molecules/NavBar";

import FooterElement from "../components/molecules/FooterElement";
import UserStoryCard from "../components/molecules/UserStoryCard";

const Root = styled('div')(({theme}) => ({
    flexGrow: 1,
}));
const Footer = styled('footer')(({theme}) => ({
    padding: theme.spacing(0),
}));
export default function UserStories ()  {
    const featuresRef = useRef<HTMLDivElement>(null);
    return (
        <Root>
            <CssBaseline/>
            <NavBar featuresRef={featuresRef}/>
            <main>
                <UserStoryCard/>
            </main>
            <Footer>
                <FooterElement/>
            </Footer>
        </Root>
    );
};


