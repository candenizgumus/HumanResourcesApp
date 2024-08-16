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
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import { Button, Grid} from '@mui/material';
import { HumanResources, RootState} from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { changePageState} from '../../store/feature/authSlice';
import {NotificationIcon} from "../../components/atoms/NotificationIcon";
import {AdminMenuContentRenderer} from "../../components/organisms/AdminMenuContentRenderer";
import { useNavigate } from 'react-router-dom';
import NavbarProfile from "../../components/atoms/NavbarProfile";
import AdminHomeContent  from "../../components/molecules/AdminPageComponents/AdminHomeContent"
import {
  AccountBox,
  AdminPanelSettings,
  Apartment,
  FeaturedPlayList,
  Person,
  Weekend
} from "@mui/icons-material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

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
  

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const navigateToHome = () => {
    dispatch(changePageState(''));
  };
  
  const handleListItemClick = (text: string) => {
    setSelectedIndex(text);
    dispatch(changePageState(text));
  };

  
  return (
    <Box sx={{ display: 'flex'  }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={logoStyle}>
            <Button style={{ marginRight: '20px' }} onClick={navigateToHome} color="inherit">
                Easy HR
            </Button>
        </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <NotificationIcon/>
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
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {['Offers', 'Users', 'Create Admin', 'Create Feature', 'Create Definition', 'Holidays', 'Profile','Companies', 'Notifications'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => handleListItemClick(text)}>
                <ListItemIcon>
                  { index === 0 && <LocalOfferIcon />}
                  {index  === 1 && <Person />}
                  {index  === 2 && <AdminPanelSettings />}
                  {index  === 3 && <FeaturedPlayList /> }
                  {index  === 4 && <DesignServicesIcon /> }
                  {index  === 5 && <Weekend /> }
                  {index  === 6 && <AccountBox /> }
                  {index  === 7 && <Apartment /> }
                  {index  === 8 && <NotificationsIcon/>}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Grid container spacing={2}>
          { pageState=== '' ? <AdminHomeContent/> : <AdminMenuContentRenderer/>}
        </Grid>
      </Main>
    </Box>
  );
}
