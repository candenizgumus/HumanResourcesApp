import React, {useEffect, useState} from 'react';
import { Avatar, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {useDispatch} from "react-redux";
import {HumanResources, useAppSelector} from "../../store";
import {
    changePageState,
    clearToken,
    fetchFindCompanyNameAndManagerNameOfUser,
    fetchFindUserByToken
} from "../../store/feature/authSlice";
import {useNavigate} from "react-router-dom";

export default function NavbarProfile() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const dispatch = useDispatch<HumanResources>();
    const navigate = useNavigate();



    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        dispatch(changePageState('Profile'));
        handleMenuClose();
    };

    const handleLogout = () => {
        dispatch(clearToken())

        navigate('/')
        handleMenuClose();
    };



    return (
        <div>
            <Tooltip title="Account settings">
                <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 2 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                        <AccountCircleIcon />
                    </Avatar>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </div>
    );
}
