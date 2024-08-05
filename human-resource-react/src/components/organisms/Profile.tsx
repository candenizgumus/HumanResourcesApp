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


  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repassword, setRePassword] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [managerName, setManagerName] = useState<string>('');
    const user:IUser = useAppSelector((state) => state.auth.user);
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useDispatch<HumanResources>();
    const [positions, setPositions] = useState([]);
    const [selectedPositions, setSelectedPositions] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', );
  };

  const handleLogin = async () => {
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
        handleLogin();
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
                          onChange={event => setName(event.target.value)}
                          fullWidth
                          required
                      />
                      <TextField
                          label='Surname'
                          name="surname"
                          value={user.surname}
                          onChange={event => setSurname(event.target.value)}
                          fullWidth
                          required
                      />
                      <TextField
                          label='Phone'
                          name="phone"
                          value={user.phone}
                          onChange={event => setPhone(event.target.value)}
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
                          name="phone"
                          value={managerName}
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
