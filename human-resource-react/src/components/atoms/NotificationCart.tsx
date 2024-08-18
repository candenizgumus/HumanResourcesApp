import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useDispatch } from 'react-redux';
import { HumanResources, useAppSelector } from '../../store';
import { changePageState } from '../../store/feature/authSlice';
import { fetchGetUnreadNotifications, fetchUpdateIsRead } from '../../store/feature/notificationSlice';
import AssistantPhotoIcon from '@mui/icons-material/AssistantPhoto';
export default function NotificationCart(props: { notificationText: string, notificationType: string, url: string, id:number, isRead:boolean }) {
    const theme = useTheme();
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const handleClick = () => {
        dispatch(changePageState(props.url));
        dispatch(fetchUpdateIsRead({
            token,
            id:props.id,
            isRead: true
        })).then(()=>{
            dispatch(fetchGetUnreadNotifications(token));
        })
        
    };

    const getIcon = () => {
        switch (props.notificationType) {
            case 'INFORMATION':
                return <InfoIcon sx={{ color: theme.palette.info.main }} />;
            case 'WARNING':
                return <WarningIcon sx={{ color: theme.palette.warning.main }} />;
            case 'ERROR':
                return <ErrorIcon sx={{ color: theme.palette.error.main }} />;
            case 'SUCCESS':
                return <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
            case 'ASSIST':
                return <AssistantPhotoIcon style={{ color: '#673AB7' }} />;
            default:
                return null;
        }
    };

    return (
        <Card 
            sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                borderRadius: 2, 
                boxShadow: 3, 
                marginBottom: '5px',
                cursor: 'pointer', 
                '&:hover': {
                    boxShadow: 10,
                }
            }} 
            onClick={handleClick}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto', padding: theme.spacing(1) }}>
                    <Typography variant="subtitle2" color="text.secondary" component="div">
                        {props.notificationText}
                    </Typography>
                </CardContent>
            </Box>
            <IconButton aria-label={props.notificationType} sx={{ padding: theme.spacing(1) }}>
                {getIcon()}
            </IconButton>
        </Card>
    );
}
