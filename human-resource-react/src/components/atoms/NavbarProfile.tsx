import React, { useEffect, useState } from 'react';
import { Avatar, Badge, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useDispatch } from "react-redux";
import { HumanResources, useAppSelector } from "../../store";
import {
    changePageState,
    clearToken,
    fetchFindCompanyNameAndManagerNameOfUser,
    fetchFindUserByToken
} from "../../store/feature/authSlice";
import { useNavigate } from "react-router-dom";

export default function NavbarProfile() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const dispatch = useDispatch<HumanResources>();
    const navigate = useNavigate();
    const token = useAppSelector((state) => state.auth.token);
    const loggedInUser = useAppSelector(state => state.auth.user);



    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleChangePassword = () => {
        dispatch(changePageState('Change Password'));
        handleMenuClose();
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

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(fetchFindUserByToken(token))
            } catch {
                dispatch(clearToken());
            }
        };
    
        fetchData();
    }, [dispatch, token]);

    return (
        <div>
            <Tooltip title="Account settings">
                <IconButton onClick={handleMenuOpen} color="inherit" sx={{ ml: 2 }}>
                    <Badge color="secondary">
                        {/* <AccountCircleIcon fontSize='large' /> */}
                        <Avatar src={loggedInUser.photo} alt={loggedInUser.name} sx={{ width: 40, height: 40, objectFit: 'cover', objectPosition: 'top' }} />
                    </Badge>
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
                <MenuItem onClick={handleChangePassword}>Change Password</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </div>
    );
}
