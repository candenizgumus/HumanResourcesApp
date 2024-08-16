import React, {useState, FormEvent, useEffect} from 'react';
import {TextField, Button, Box, Grid, InputLabel, Select, MenuItem, FormControl, Avatar} from '@mui/material';
import {HumanResources, useAppSelector} from "../../../store";
import {
     fetchFindUserById,
    fetchGetPositions, fetchUpdateEmployeeByManager
} from "../../../store/feature/authSlice";
import {useDispatch} from "react-redux";
import { SelectChangeEvent } from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";
import sweetalert2 from "sweetalert2";
import Swal from "sweetalert2";
import { fetchGetDefinitions, IDefinition } from '../../../store/feature/definitionSlice';
import { EDefinitionType } from '../../../models/IDefinitionType';
import { setHours } from 'date-fns';




const EditEmployee: React.FC = () => {


    const token = useAppSelector((state) => state.auth.token);
    const employeeId = useAppSelector((state) => state.auth.selectedEmployeeId);
    const dispatch = useDispatch<HumanResources>();
    const [name, setName] = useState<string>( '');
    const [surname, setSurname] = useState<string>( '');
    const [email, setEmail] = useState<string>( '');
    const [phone, setPhone] = useState<string>( '');
    const [title, setTitle] = useState<string>( '');
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [photo, setPhoto] = useState<string>('');
    const [hireDate, setHireDate] = useState<Date | null>(null);
    const [location, setLocation] = useState<string>('') ;
    const [positions, setPositions] = useState<IDefinition[]>([]);
    const [employeeTypes, setEmployeeTypes] = useState<IDefinition[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<string>('');

    const [selectedEmployeeType, setSelectedEmployeeType] = useState<string>("FULL_TIME"); //default to FULL_TIME



    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', );
    };

    const setUserInfos = async () => {
        try {
            const employeeData = await dispatch(fetchFindUserById({
                token:token,
                id:employeeId
            }))


            setName(employeeData.payload.name);
            setSurname(employeeData.payload.surname);
            setEmail(employeeData.payload.email);
            setPhone(employeeData.payload.phone);
            setTitle(employeeData.payload.title);
            setBirthDate(employeeData.payload.birthDate);
            setPhoto(employeeData.payload.photo);
            setHireDate(employeeData.payload.hireDate);
            setLocation(employeeData.payload.location);
            setSelectedPosition(employeeData.payload.position);
            setSelectedEmployeeType(employeeData.payload.employeeType);

            dispatch(fetchGetDefinitions({
                token,
                definitionType: EDefinitionType.POSITION
            }))
                .then(data => {
                    console.log('Positions Response:', data);  // Log the response
                    setPositions(data.payload);
                })
                .catch(error => {
                    console.error('Error fetching positions:', error);  // Handle fetch errors
                });

            dispatch(fetchGetDefinitions({
                token: token,
                definitionType: EDefinitionType.EMPLOYEE_TYPE
            }))
                .then(data => {
                    console.log('EmployeTypes Response:', data);  // Log the response
                    setEmployeeTypes(data.payload);
                })
                .catch(error => {
                    console.error('Error fetching employeTypes:', error);  // Handle fetch errors
                });






        } catch (error) {
            console.error('Error in handleLogin:', error);  // Handle other errors
        }
    };

    useEffect(() => {
        setUserInfos();

    },[])


    const updateEmployee = () => {

        if (!name || !surname   || !phone || !title  || !birthDate  || !selectedEmployeeType || !location || !hireDate || !selectedPosition) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill all the fields!',
            });
            return;
        }

        console.log(selectedEmployeeType)
        dispatch(fetchUpdateEmployeeByManager({
            employeeId: employeeId,
            token: token,
            name: name,
            surname: surname,
            phone: phone,
            title: title,
            birthDate: birthDate,
            position: selectedPosition,
            location: location,
            hireDate: hireDate,
            employeeType: selectedEmployeeType

        })).then((data) => {
            if (data.payload.message) {
                sweetalert2.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.payload.message ?? 'Failed to add employee',
                    showConfirmButton: true
                })

            }else{
                sweetalert2.fire({
                    icon: 'success',
                    title: 'Your profile has been updated successfully',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        })
    }


    return (


        <Grid container spacing={2}>
            <Grid item xs ={12}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: 800,
                        margin: 'auto',
                        alignItems: 'center',
                    }}
                >
                    <Avatar
                        alt="Remy Sharp"
                        src={photo}
                        sx={{ width: 150, height: 150 }}
                    />
                </Box>

            </Grid>
            <Grid item xs={6}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        maxWidth: 800,
                        margin: 'auto',
                        padding: 2,
                    }}
                >

                    <TextField
                        label='Name'
                        name="name"
                        value={name}
                        onChange={event => setName(event.target.value)}
                        fullWidth
                        required
                        inputProps={{ maxLength: 50 }}
                    />
                    <TextField
                        label='Surname'
                        name="surname"
                        value={surname}
                        onChange={event => setSurname(event.target.value)}
                        fullWidth
                        required
                        inputProps={{ maxLength: 50 }}
                    />
                    <TextField
                        label='E-mail'
                        name="email"
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        fullWidth
                        disabled={true}
                    />
                    <TextField
                        label='Phone'
                        name="phone"
                        value={phone}
                        onChange={event => setPhone(event.target.value)}
                        fullWidth
                        required
                        type={"tel"}
                        inputProps={{ maxLength: 50 }}
                    />

                    <TextField
                        label='Title'
                        name="title"
                        value={title}
                        onChange={event => setTitle(event.target.value)}
                        fullWidth
                        required
                        inputProps={{ maxLength: 50 }}
                    />
                    <TextField
                        label='Location'
                        name="location"
                        value={location}
                        onChange={event => setLocation(event.target.value)}
                        fullWidth
                        required
                        inputProps={{ maxLength: 50 }}
                    />





                    <Button onClick={updateEmployee} sx={{mt: 5}} type="button" variant="contained" color="primary">
                        Edit Employee
                    </Button>
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        maxWidth: 800,
                        margin: 'auto',
                        padding: 2,
                    }}
                >
                    <FormControl required variant="outlined">
                        <InputLabel>{'Please Select Your Position'}</InputLabel>
                        <Select
                            value={selectedPosition}
                            onChange={event => setSelectedPosition(event.target.value as string)}
                            label="Position"
                        >
                            {Object.values(positions).map(position => (
                                <MenuItem key={position.name} value={position.name}>
                                    {position.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl required variant="outlined">
                        <InputLabel>{'Please Select Employee Type'}</InputLabel>
                        <Select
                            value={selectedEmployeeType}
                            onChange={event => setSelectedEmployeeType(event.target.value as string)}
                            label="Employee Type"
                        >
                            {Object.values(employeeTypes).map(employeeType => (
                                <MenuItem key={employeeType.name} value={employeeType.name}>
                                    {employeeType.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <LocalizationProvider  dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Hire Date"
                            value={birthDate ? dayjs(hireDate) : null}
                            onChange={(newValue) => setHireDate(newValue ? newValue.toDate() : null)}

                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Birth Date"
                            value={birthDate ? dayjs(birthDate) : null}

                            onChange={(newValue) => setBirthDate(newValue ? newValue.toDate() : null)}

                        />
                    </LocalizationProvider>



                </Box>
            </Grid>
        </Grid>







    );
};

export default EditEmployee;
