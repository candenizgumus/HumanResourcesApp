import React, {useState, FormEvent, useEffect} from 'react';
import {
    TextField,
    Button,
    Box,
    Grid,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
    Avatar,
    OutlinedInput, InputAdornment
} from '@mui/material';
import {HumanResources, useAppSelector} from "../../../store";
import {
    fetchAddEmployeeToCompany,
} from "../../../store/feature/authSlice";
import {useDispatch} from "react-redux";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import sweetalert2 from "sweetalert2";
import Swal from "sweetalert2";
import { fetchGetDefinitions, IDefinition } from '../../../store/feature/definitionSlice';
import { EDefinitionType } from '../../../models/IDefinitionType';




const SideBarAddEmployee: React.FC = () => {


    const token = useAppSelector((state) => state.auth.token);
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
    const[salary,setSalary]=useState<number>(0)
    const [loading, setLoading] = useState(false);
    const [positions, setPositions] = useState<IDefinition[]>([]);
    const [employeeTypes, setEmployeeTypes] = useState<IDefinition[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<string>('');

    const [selectedEmployeeType, setSelectedEmployeeType] = useState<string>('');


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', );
    };

    const setUserInfos = async () => {
        try {

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
                    console.log('EmployeeTypes Response:', data);  // Log the response
                    setEmployeeTypes(data.payload);
                })
                .catch(error => {
                    console.error('Error fetching positions:', error);  // Handle fetch errors
                });

        } catch (error) {
            console.error('Error in handleLogin:', error);  // Handle other errors
        }
    };

    useEffect(() => {
        setUserInfos();
    },[])

    console.log(name, surname, phone, title, birthDate, selectedPosition, location);
    const addEmployee = async () => {

        if (!salary || !name || !surname    || !surname  || !phone || !title  || !birthDate  || !selectedEmployeeType || !location || !hireDate || !selectedPosition) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill all the fields!',
            });
            return;
        }
        setLoading(true);
        const result = await dispatch(fetchAddEmployeeToCompany({
            token: token,
            name: name,
            surname: surname,
            phone: phone,
            title: title,
            birthDate: birthDate,
            position: selectedPosition,
            location: location,
            hireDate:hireDate,
            employeeType: selectedEmployeeType,
            email: email,
            salary: salary
        }))
        if (result.payload.message) {
            sweetalert2.fire({
                icon: 'error',
                title: 'Oops...',
                text: result.payload.message ?? 'Failed to add employee',
                showConfirmButton: true
            })
            setLoading(false);
        }else{
            sweetalert2.fire({
                icon: 'success',
                title: 'Your profile has been updated successfully',
                showConfirmButton: false,
                timer: 1500
            })
            setLoading(false);
        }

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
                        required
                        inputProps={{ maxLength: 50 }}
                    />
                    <TextField
                        label='Phone'
                        name="phone"
                        value={phone}
                        onChange={event => setPhone(event.target.value)}
                        fullWidth
                        required
                        type={"number"}
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





                    <Button onClick={addEmployee} sx={{mt: 5}} type="button" variant="contained" color="primary" disabled={loading}>
                        {loading ? "SAVING..." : "ADD EMPLOYEE"}
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
                        <InputLabel>{'Please Select Position'}</InputLabel>
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
                    <FormControl fullWidth >
                        <InputLabel htmlFor="outlined-adornment-amount">Salary</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            label="Salary"
                            value={salary ?? ''} // Set the value of the input
                            onChange={e => {
                                const value = e.target.value;
                                setSalary(value ? parseInt(value) : 0); // Eğer value geçersizse 0 olarak ayarla
                            }}
                        />
                    </FormControl>


                </Box>
            </Grid>
        </Grid>







    );
};

export default SideBarAddEmployee;
