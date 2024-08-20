import React, { useState, ChangeEvent, FormEvent } from 'react';
import { TextField, Button, Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { fetchCreateUserWithUserType } from '../../../store/feature/authSlice';
import { HumanResources } from '../../../store';
import Swal from "sweetalert2";
import { IUserType } from '../../../models/IUserType';
import {AddIcon} from '../../atoms/icons';
import { myErrorColour, myLightColour } from '../../../util/MyColours';

const UserForm: React.FC = () => {
  const dispatch = useDispatch<HumanResources>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    try {
      let result = await dispatch(fetchCreateUserWithUserType({
        email: email,
        password: password,
        token: localStorage.getItem('token') ?? '',
        userType: IUserType.ADMIN
      })).unwrap();
      if (result.code) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message,
          confirmButtonColor: myLightColour,
          cancelButtonColor: myErrorColour,
        });
        setLoading(false);
        return; // Stop the process and prevent further then block executions
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Admin Account Created.',
        confirmButtonColor: myLightColour,
        cancelButtonColor: myErrorColour,
      });
      setEmail('');
      setPassword('');
      setLoading(false);
    } catch (error) {
      console.error("Error creating admin:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'There was a problem creating admin.',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        margin: 'auto',
        padding: 2,
        marginTop: '2%'
      }}
    >
      <Box
        sx={{
          padding: 2,
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
          border: '1px solid red',
          borderRadius: 1,
          fontWeight: 'bold',
          color: 'red',
        }}
      >
        <Typography variant="h6">
          Warning: Creating an admin account can have serious security implications. Please ensure you understand the consequences before proceeding.
        </Typography>
      </Box>
      <TextField
        label="Email"
        name="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        fullWidth
        required
        inputProps={{ maxLength: 64 }}
      />
      <TextField
        label="Password"
        name="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        fullWidth
        required
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={accepted}
            onChange={e => setAccepted(e.target.checked)}
          />
        }
        label="I understand the consequences of creating an admin account."
      />
      <Button
        type="submit"
        variant="contained"
        color="success"
        disabled={loading || !accepted || !password || !email}
        startIcon={<AddIcon />}
      >
        Create
      </Button>
    </Box>
  );
};

export default UserForm;
