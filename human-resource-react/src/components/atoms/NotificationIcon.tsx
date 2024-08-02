import React from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import NotificationsIcon from '@mui/icons-material/Notifications'; // Import the icon correctly

export const NotificationIcon = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setAnchorEl(null);
    };

    const openPopover = Boolean(anchorEl);
    const id = openPopover ? 'notification-popover' : undefined;

    return (
        <>
            <IconButton color="inherit" onClick={handleNotificationClick}>
                <Badge badgeContent={5} color="secondary">
                    <NotificationsIcon /> {/* Use the imported icon here */}
                </Badge>
            </IconButton>
            <Popover
                id={id}
                open={openPopover}
                anchorEl={anchorEl}
                onClose={handleNotificationClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6">Notifications</Typography>
                    <Divider />
                    <Typography variant="body1">You have 3 new notifications.</Typography>
                </Box>
            </Popover>
        </>
    );
};
