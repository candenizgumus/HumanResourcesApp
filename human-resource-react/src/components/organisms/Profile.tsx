import React, {useState, ChangeEvent, FormEvent, useEffect} from 'react';
import {TextField, Button, Box, Grid, InputLabel, Select, MenuItem, FormControl} from '@mui/material';
import {HumanResources, useAppSelector} from "../../store";
import {IUser} from "../../models/IUser";
import {
    fetchFindCompanyNameAndManagerNameOfUser,
    fetchFindUserByToken,
    fetchGetPositions
} from "../../store/feature/authSlice";
import {useDispatch} from "react-redux";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";


interface UpdateProfile {
  name: string;
  surname: string;
  phone: string;
  password : string;
  repassword : string;
    companyName: string;
    managerName: string;
}

const Profile: React.FC = () => {

    const user:IUser = useAppSelector((state) => state.auth.user);
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useDispatch<HumanResources>();
  const [name, setName] = useState<string>(user.name ?? '');
  const [surname, setSurname] = useState<string>(user.surname ?? '');
    const [phone, setPhone] = useState<string>(user.phone ?? '');
    const [birthDate, setBirthDate] = useState<Date | null>(user.birthDate);
    const [hireDate, setHireDate] = useState(user.hireDate ?? '');
    const [userType, setUserType] = useState<string>(user.userType ?? '');
    const [position, setPosition] = useState<string>(user.position ?? '');
    const [sector, setSector] = useState<string>(user.sector ?? '');
    const [location, setLocation] = useState<string>(user.location ?? '') ;
    const [employeeType, setEmployeeType] = useState<string>(user.employeeType ?? '');
    const [subscriptionType, setSubscriptionType] = useState<string>(user.subscriptionType ?? '');
    const [subscriptionStartDate, setSubscriptionStartDate] = useState(user.subscriptionStartDate ?? '');
    const [subscriptionEndDate, setSubscriptionEndDate] = useState(user.subscriptionEndDate ?? '');
    const [password, setPassword] = useState<string>('');
    const [repassword, setRePassword] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [managerName, setManagerName] = useState<string>('');

    const [positions, setPositions] = useState([]);
    const [selectedPositions, setSelectedPositions] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', );
  };
    const formatDate = (date: Date | null) => {
        return date ? dayjs(date).format('YYYY-MM-DD') : null;
    };
  const setUserInfos = async () => {
    try {
        dispatch(fetchFindUserByToken(token));

        let result = await dispatch(fetchFindCompanyNameAndManagerNameOfUser(token)).unwrap();
        console.log('Company and Manager Response:', result);  // Log the response

        if (result.code) {
            return; // Stop further execution if there's an error
        }

        setCompanyName(result.companyName ?? '');
        setManagerName(result.managerName ?? '');

        dispatch(fetchGetPositions())
            .then(data => {
                console.log('Positions Response:', data);  // Log the response
                setPositions(data.payload);
            })
            .catch(error => {
                console.error('Error fetching positions:', error);  // Handle fetch errors
            });

    } catch (error) {
        console.error('Error in handleLogin:', error);  // Handle other errors
    }
};
    console.log(formatDate(birthDate));

    useEffect(() => {
        setUserInfos();
    },[])

  return (


          <Grid container spacing={2}>

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
                      />
                      <TextField
                          label='Surname'
                          name="surname"
                          value={surname}
                          onChange={event => setSurname(event.target.value)}
                          fullWidth
                          required
                      />
                      <TextField
                          label='Phone'
                          name="phone"
                          value={phone}
                          onChange={event => setPhone(event.target.value)}
                          fullWidth
                          required
                      />
                      <TextField
                          label='Location'
                          name="location"
                          value={location}
                          onChange={event => setLocation(event.target.value)}
                          fullWidth
                          required
                      />

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                              label="Birth Date"
                              value={birthDate ? dayjs(birthDate) : null}

                              onChange={(newValue) => setBirthDate(newValue ? newValue.toDate() : null)}

                          />
                      </LocalizationProvider>

                      <FormControl variant="outlined">
                          <InputLabel>{user.position ?? 'Please Select Your Position'}</InputLabel>
                          <Select
                              value={selectedPositions}
                              onChange={event => setSelectedPositions(event.target.value as string)}
                              label="Position"
                          >
                              {positions.map((position) => (
                                  <MenuItem key={position} value={position}>
                                      {position}
                                  </MenuItem>
                              ))}
                          </Select>
                      </FormControl>
                      <Button sx={{mt: 5}} type="button" variant="contained" color="primary">
                          Update Profile
                      </Button>
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
                          label="User Type"
                          name="userType"
                          value={user.userType}
                          fullWidth
                          disabled={true}
                      />
                      {companyName && (
                          <TextField
                              label="Company Name"
                              name="companyName"
                              value={companyName}
                              fullWidth
                              disabled
                          />
                      )}

                      <TextField
                          label="Manager Name"
                          name="managerName"
                          value={managerName}
                          fullWidth
                          disabled
                      />
                      <TextField
                          label="Subscription Type"
                          name="subscriptionType"
                          value={subscriptionType}
                          fullWidth
                          disabled
                      />
                      <TextField
                          label="Subscription Start Date"
                          name="subscriptionStartDate"
                          value={subscriptionStartDate}
                          fullWidth
                          disabled
                      />
                      <TextField
                          label="Subscription End Date"
                          name= "subscriptionEndDate"
                          value={subscriptionEndDate}
                          fullWidth
                          disabled
                      />
                      <TextField
                          label="Hired Date"
                          name= "hireDate"
                          value={hireDate}
                          fullWidth
                          disabled
                      />


                  </Box>
              </Grid>
          </Grid>







  );
};

export default Profile;
