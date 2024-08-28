import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Button, Grid, useMediaQuery } from '@mui/material';
import { HumanResources, RootState, useAppSelector } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { changePageState } from '../../store/feature/authSlice';
import { NotificationIcon } from "../../components/atoms/NotificationIcon";
import { useNavigate } from 'react-router-dom';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import NavbarProfile from "../../components/atoms/NavbarProfile";
import { ManagerMenuContentRenderer } from "../../components/organisms/ManagerMenuContentRenderer";
import {
    AccountBox,
    Apartment,
    DocumentScanner, Paid,
    Payments,
    Person,
    PersonAdd,
    PointOfSale,
    AdminPanelSettings,
    Weekend, Laptop, Dashboard, DuoTwoTone, Task
} from "@mui/icons-material";
import AddCommentIcon from '@mui/icons-material/AddComment';
import { ManagerHomeContent } from "../../components/molecules/ManagerComponents/ManagerHomeContent";
import HikingIcon from '@mui/icons-material/Hiking';
import { useState } from "react";
import logo from '../../images/logo-full-white.png';
import { AddDocumentIcon } from "../../components/atoms/icons";
import { myLightColour } from "../../util/MyColours";
import ThemeElement from '../../components/atoms/ThemeElement';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    width: `calc(100% - ${drawerWidth}px)`, // Genişliği sabit tut, Drawer açıldığında içerik sağa itilmez
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

const logoStyle = {
    flexGrow: 1,
    color: 'white',
    transition: 'color 0.3s ease',
};

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    width: `calc(100% - ${drawerWidth}px)`, // Genişliği sabit tut, Drawer açıkken de değişmez
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
    }),
    ...(!open && {
        marginLeft: 0,
        width: '100%',
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function AdminPage() {
    const navigate = useNavigate();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState<string>('Inbox');
    const dispatch = useDispatch<HumanResources>();
    const pageState = useSelector((state: RootState) => state.auth.pageState);
    const [selectedIndex2, setSelectedIndex2] = useState(0);
    const page = useAppSelector((state) => state.auth.pageState);
    const user = useAppSelector((state) => state.auth.user);
    const isBigForScreen = useMediaQuery('(max-width:1200px)');
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    const navigateToHome = () => {
        setSelectedIndex2(0);
        dispatch(changePageState('Dashboard'));
    };

    const handleListItemClick = (text: string) => {
        setSelectedIndex(text);
        dispatch(changePageState(text));
    };


    const handleListItemClick2 = (index: any) => {
        setSelectedIndex2(index);
        // Perform your action here
    };

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    return (
        <ThemeElement children={
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" open={open}>
                    <Toolbar >
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{ mr: 2, ...(open && { display: 'none' }) }}
                        >
                            <MenuIcon />
                        </IconButton>
                        {(open && isBigForScreen) ? null : (
                            <Typography variant="h6" sx={logoStyle}>
                                <Button onClick={navigateToHome} color="inherit">
                                    <img src={logo} alt="logo" style={{ height: '52px' }} />
                                </Button>
                            </Typography>
                        )}
                        {(open && isBigForScreen) ? null : (
                            <Typography
                                sx={{
                                    position: 'absolute',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    fontSize: '20px',
                                }}
                            >
                                {page ? page : 'Dashboard'}
                            </Typography>
                        )}
                        {!isBigForScreen && (
                            <Box>
                                <Typography variant="h5" component="div" >
                                    Hello, <strong>{user.name ? user.name : 'admin'}</strong>!
                                </Typography>
                                <Typography variant="subtitle1" sx={{ marginRight: 1 }} >
                                    <span style={{ fontStyle: 'italic', color: myLightColour }}>{today}  </span>
                                </Typography>
                            </Box>
                        )}
                        {(open && isBigForScreen) ? null : (
                            <NotificationIcon />
                        )}
                        <NavbarProfile />
                    </Toolbar>
                </AppBar>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant="persistent"
                    anchor="left"
                    open={open}
                >
                    <DrawerHeader sx={{ bgcolor: 'primary.main' }}>
                        <IconButton onClick={handleDrawerClose} sx={{ color: 'white' }}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <List sx={{ bgcolor: 'primary.main', minHeight: 'calc(100vh - 65px)', paddingTop: '0' }}>
                        {['Dashboard', 'Employees', 'Add Employee', 'Create Manager', 'Create Definition', 'Profile', 'Company', 'Add Comment', 'Holidays', 'Notifications', 'Expenditure', 'Leaves', 'Payments', 'Personal Documents', 'Bonus', 'Company Items', 'Task', 'Create Slide', 'Slide'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton
                                    selected={selectedIndex2 === index}
                                    onClick={() => {
                                        handleListItemClick2(index);
                                        handleListItemClick(text);
                                    }}
                                    sx={{
                                        color: 'white',
                                        backgroundColor: 'primary.main',
                                        '&.Mui-selected': {
                                            backgroundColor: 'myLightColour.main', // Change background color when selected
                                            '&:hover': {
                                                backgroundColor: 'myLightColour.main', // Change background color on hover
                                            },
                                        },
                                        '&:hover': {
                                            backgroundColor: 'mySecondaryColor.main', // Change background color on hover
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ color: 'white' }}>
                                        {index === 0 && <Dashboard />}
                                        {index === 1 && <Person />}
                                        {index === 2 && <PersonAdd />}
                                        {index === 3 && <AdminPanelSettings />}
                                        {index === 4 && <DesignServicesIcon />}
                                        {index === 5 && <AccountBox />}
                                        {index === 6 && <Apartment />}
                                        {index === 7 && <AddCommentIcon />}
                                        {index === 8 && <Weekend />}
                                        {index === 9 && <NotificationsIcon />}
                                        {index === 10 && <PointOfSale />}
                                        {index === 11 && <HikingIcon />}
                                        {index === 12 && <Payments />}
                                        {index === 13 && <AddDocumentIcon />}
                                        {index === 14 && <Paid />}
                                        {index === 15 && <Laptop />}
                                        {index === 16 && <Task />}
                                        {index === 17 && <Laptop />}
                                        {index === 18 && <Laptop />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <Main open={open}>
                    <DrawerHeader />
                    <Grid container spacing={2}>
                        {pageState === 'Dashboard' ? <ManagerHomeContent open={open} /> : <ManagerMenuContentRenderer />}
                    </Grid>
                </Main>
            </Box>
        } />
    );
}
