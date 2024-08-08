import { Box, Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { fetchGetPasswordResetCode, setIsCodeSend } from "../../../store/feature/passwordResetSlice";
import { useDispatch } from "react-redux";
import { HumanResources } from "../../../store";
import Swal from "sweetalert2";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { CodeRounded } from "@mui/icons-material";
import { useLocation } from "react-router-dom";

const PasswordResetRequestForm: React.FC = () => {
    const dispatch = useDispatch<HumanResources>();
    const [email, setEmail] = useState<string>('');
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<number>(0);
    const location = useLocation();
    React.useEffect(() => {
        // Get the token from the URL query params
        const searchParams = new URLSearchParams(location.search);
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            dispatch(setIsCodeSend(true));
            setIsDisabled(true);
            const endTime = Date.now() + 180 * 1000; // 3 minutes in milliseconds
            localStorage.setItem('countdownEndTime', endTime.toString());
            setCountdown(5);
        }
    }, [location.search]);
    // Function to calculate remaining time based on end time
    const calculateRemainingTime = (endTime: number) => {
        const now = Date.now();
        const remainingTime = endTime - now;
        return Math.max(0, Math.floor(remainingTime / 1000));
    };

    useEffect(() => {
        const storedEndTime = localStorage.getItem('countdownEndTime');
        if (storedEndTime) {
            const endTime = parseInt(storedEndTime, 10);
            const remainingTime = calculateRemainingTime(endTime);
            if (remainingTime > 0) {
                setIsDisabled(true);
                setCountdown(remainingTime);
            } else {
                localStorage.removeItem('countdownEndTime');
            }
        }
    }, []);

    useEffect(() => {
        if (countdown > 0) {
            const timerId = setInterval(() => {
                setCountdown((prevCountdown) => {
                    const newCountdown = prevCountdown - 1;
                    if (newCountdown <= 0) {
                        localStorage.removeItem('countdownEndTime');
                        setIsDisabled(false);
                        return 0;
                    }
                    const endTime = Date.now() + newCountdown * 1000;
                    localStorage.setItem('countdownEndTime', endTime.toString());
                    return newCountdown;
                });
            }, 1000);
            return () => clearInterval(timerId);
        }
    }, [countdown]);

    const handleSubmit = async (email: string) => {
        setIsDisabled(true);
        const endTime = Date.now() + 180 * 1000; // 3 minutes in milliseconds
        localStorage.setItem('countdownEndTime', endTime.toString());
        setCountdown(5); // 3 minutes in seconds
        let result = await dispatch(fetchGetPasswordResetCode({ email })).unwrap();
        if (result.code) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: result.message,
          });
          dispatch(setIsCodeSend(false));
                    setIsDisabled(false);
          return; // Stop the process and prevent further then block executions
        }

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Password reset code has been sent.',
        });
        dispatch(setIsCodeSend(true));
      };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <Box
            sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Avatar sx={{ mt: 3, mb: 1, bgcolor: '#606c38' }}>
                <CodeRounded />
            </Avatar>
            <Typography component="h1" variant="h5">
                Get Password Reset Code
            </Typography>

            <TextField
                sx={{ mt: 2 }}
                label="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                autoComplete="off"
                // Optionally add a validation regex
                // error={!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)}
                // helperText="Please enter a valid email address"
            />
            <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
                onClick={() => handleSubmit(email)}
                disabled={isDisabled}
            >
                {isDisabled ? `Please wait ${formatTime(countdown)}` : 'Get password reset code'}
            </Button>
        </Box>
    );
};

export default PasswordResetRequestForm;
