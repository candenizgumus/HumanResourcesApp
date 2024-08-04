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
  const [formData, setFormData] = useState<UpdateProfile>({
    name: '',
    surname: '',
    phone: '',
      password : '',
      repassword: '',
      companyName: '',
      managerName: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const user:IUser = useAppSelector((state) => state.auth.user);
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useDispatch<HumanResources>();
    const [positions, setPositions] = useState([]);
    const [selectedPositions, setSelectedPositions] = useState<string>('');


    useEffect(() => {
        dispatch(fetchFindUserByToken(token))
        dispatch(fetchFindCompanyNameAndManagerNameOfUser(token))
            .then(data => {
                setFormData(
                    {
                        ...formData,
                        companyName: data.payload.companyName ?? '',
                        managerName: data.payload.managerName ?? ''
                    }
                )
            }).then(() => {
            dispatch(fetchGetPositions())
                .then(data => {
                    setPositions(data.payload)
                })
        })


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
                          value={user.name}
                          onChange={handleChange}
                          fullWidth
                          required
                      />
                      <TextField
                          label='Surname'
                          name="surname"
                          value={user.surname}
                          onChange={handleChange}
                          fullWidth
                          required
                      />
                      <TextField
                          label='Phone'
                          name="phone"
                          value={user.phone}
                          onChange={handleChange}
                          fullWidth
                          required
                      />
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
                          name="name"
                          value={user.userType}
                          onChange={handleChange}
                          fullWidth

                          disabled={true}
                      />
                      <TextField
                          label="Company Name"
                          name="surname"
                          value={formData.companyName}
                          onChange={handleChange}
                          fullWidth

                          disabled={true}
                      />
                      <TextField
                          label="Manager Name"
                          name="phone"
                          value={formData.managerName}
                          onChange={handleChange}
                          fullWidth
                          disabled
                      />

                      <Button type="button" variant="contained" color="primary">
                          Update Profile
                      </Button>
                  </Box>
              </Grid>
          </Grid>







  );
};

export default Profile;
