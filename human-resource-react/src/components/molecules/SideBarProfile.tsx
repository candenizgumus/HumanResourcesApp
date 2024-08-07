import React, {useState, ChangeEvent, FormEvent, useEffect} from 'react';
import {TextField, Button, Box, Grid, InputLabel, Select, MenuItem, FormControl, Avatar} from '@mui/material';
import {HumanResources, useAppSelector} from "../../store";
import {IUser} from "../../models/IUser";
import {
    fetchFindCompanyNameAndManagerNameOfUser,
    fetchFindUserByToken,
    fetchGetPositions, fetchUpdateUser
} from "../../store/feature/authSlice";
import {useDispatch} from "react-redux";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import sweetalert2 from "sweetalert2";
import Swal from "sweetalert2";




const SideBarProfile: React.FC = () => {

    const user:IUser = useAppSelector((state) => state.auth.user);
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useDispatch<HumanResources>();
    const [name, setName] = useState<string>(user.name ?? '');
    const [surname, setSurname] = useState<string>(user.surname ?? '');
    const [phone, setPhone] = useState<string>(user.phone ?? '');
    const [title, setTitle] = useState<string>(user.title ?? '');
    const [birthDate, setBirthDate] = useState<Date | null>(user.birthDate);
    const [photo, setPhoto] = useState<string>(user.photo ?? 'https://cdn4.iconfinder.com/data/icons/gray-business-1/512/xxx010-512.png');
    const [hireDate, setHireDate] = useState(user.hireDate ?? '');
    const [userType, setUserType] = useState<string>(user.userType ?? '');
    const [sector, setSector] = useState<string>(user.sector ?? '');
    const [location, setLocation] = useState<string>(user.location ?? '') ;
    const [employeeType, setEmployeeType] = useState<string>(user.employeeType ?? '');
    const [subscriptionType, setSubscriptionType] = useState<string>(user.subscriptionType ?? '');
    const [subscriptionStartDate, setSubscriptionStartDate] = useState(user.subscriptionStartDate ?? '');
    const [subscriptionEndDate, setSubscriptionEndDate] = useState(user.subscriptionEndDate ?? '');

    const [companyName, setCompanyName] = useState<string>('');
    const [managerName, setManagerName] = useState<string>('');

    const [positions, setPositions] = useState([]);
    const [selectedPositions, setSelectedPositions] = useState<string>(user.position ?? '');

    console.log(user);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', );
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

    useEffect(() => {
        setUserInfos();
    },[])

    console.log(name, surname, phone, title, birthDate, selectedPositions, location);
    const updateUserProfile = () => {

        if (!name || !surname  || !phone || !title  || !birthDate  || !selectedPositions || !location) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill all the fields!',
            });
            return;
        }
        dispatch(fetchUpdateUser({
            token: token,
            name: name,
            surname: surname,
            phone: phone,
            title: title,
            birthDate: birthDate,
            position: selectedPositions,
            location: location

        })).then((data) => {
            if (data.payload) {
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
                          type={"number"}
                      />

                      <TextField
                          label='Title'
                          name="title"
                          value={title}
                          onChange={event => setTitle(event.target.value)}
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
                          <InputLabel>{'Please Select Your Position'}</InputLabel>
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
                      <Button onClick={updateUserProfile} sx={{mt: 5}} type="button" variant="contained" color="primary">
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
                          value={userType}
                          fullWidth
                          disabled
                      />
                      {
                          user.sector && (
                              <TextField
                                  label="Sector"
                                  name="sector"
                                  value={sector}
                                  fullWidth
                                  disabled
                              />
                          )
                      }

                      {
                          user.companyId &&
                          (
                              <TextField
                                  label="Company Name"
                                  name="companyName"
                                  value={companyName}
                                  fullWidth
                                  disabled
                              />
                          )
                      }
                      {
                          user.managerId && (
                              <TextField
                                  label="Manager Name"
                                  name="managerName"
                                  value={managerName}
                                  fullWidth
                                  disabled
                              />
                          )
                      }
                      {
                          user.subscriptionType && (
                              <TextField
                                  label="Subscription Type"
                                  name="subscriptionType"
                                  value={subscriptionType}
                                  fullWidth
                                  disabled
                              />
                          )
                      }
                      {
                          user.subscriptionStartDate && (
                              <TextField
                                  label="Subscription Start Date"
                                  name="subscriptionStartDate"
                                  value={subscriptionStartDate}
                                  fullWidth
                                  disabled
                              />
                          )
                      }

                      {
                          user.subscriptionEndDate && (
                              <TextField
                                  label="Subscription End Date"
                                  name="subscriptionEndDate"
                                  value={subscriptionEndDate}
                                  fullWidth
                                  disabled
                              />
                          )
                      }

                      {
                          user.hireDate && (
                              <TextField
                                  label="Hired Date"
                                  name= "hireDate"
                                  value={hireDate}
                                  fullWidth
                                  disabled
                              />
                          )
                      }


                  </Box>
              </Grid>
          </Grid>







  );
};

export default SideBarProfile;
