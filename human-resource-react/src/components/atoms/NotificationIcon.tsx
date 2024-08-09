import React, { useEffect } from 'react';
import { Badge, IconButton, Popover, Box, Tooltip, Typography, Button, Divider } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useDispatch, useSelector } from 'react-redux';
import { HumanResources, RootState, useAppSelector } from '../../store';
import { fetchGetUnreadNotifications, INotification } from '../../store/feature/notificationSlice';
import { changePageState, clearToken } from '../../store/feature/authSlice';
import NotificationCart from './NotificationCart';

export const NotificationIcon = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const notificationList: INotification[] = useAppSelector((state) => state.notification.notificationList);
    const pageState = useSelector((state: RootState) => state.auth.pageState);
    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(fetchGetUnreadNotifications(token));
            } catch {
                dispatch(clearToken());
            }
        };
        fetchData();
    }, [dispatch, token]);

    const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setAnchorEl(null);
    };

    const handleShowMore = () => {
        dispatch(changePageState('Notifications')); 
        setAnchorEl(null);
    };

    const openPopover = Boolean(anchorEl);
    const id = openPopover ? 'notification-popover' : undefined;

    return (
        <>  <Tooltip title="Notifications">
                <IconButton color="inherit" onClick={handleNotificationClick}>
                    <Badge badgeContent={notificationList.length} color="secondary">
                        <NotificationsActiveIcon fontSize='large'/> 
                    </Badge>
                </IconButton>
            </Tooltip>
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
                PaperProps={{
                    sx: {
                        mt: 1.5, // Margin top to move the popover down
                        maxHeight: '300px', // Set the max height for the popover
                        width: '300px', // Optional: you can also set a specific width
                    },
                }}
            >
                <Box sx={{ p: 2, overflow: 'auto' }}>
                    <Button
                        fullWidth
                        variant="text"
                        onClick={handleShowMore}
                        sx={{ mt: 1 }}
                    >
                        Show More
                    </Button>
                    <Divider sx={{ my: 1 }} />
                    {notificationList.length > 0 ? (
                        <>
                            {notificationList.map((notification) => (
                                <NotificationCart
                                    key={notification.id}
                                    notificationText={notification.notificationText}
                                    notificationType={notification.notificationType}
                                    url={notification.url}
                                    id={notification.id}
                                    isRead={notification.isRead}
                                />
                            ))}
                        </>
                    ) : (
                        <Typography>No notifications available.</Typography>
                    )}
                </Box>
            </Popover>
        </>
    );
};
