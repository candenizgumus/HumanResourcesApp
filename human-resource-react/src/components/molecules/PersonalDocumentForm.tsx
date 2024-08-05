import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { HumanResources } from '../../store';
import {fetchCreateHoliday, fetchHolidays} from '../../store/feature/holidaySlice';
import Swal from 'sweetalert2';
import {Box, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem} from '@mui/material';


const PersonalDocumentFormSection = () => {

    return (
        <Box sx={{ flexGrow: 1, padding: 2 }}>

        </Box>
    );
}

export default PersonalDocumentFormSection;


