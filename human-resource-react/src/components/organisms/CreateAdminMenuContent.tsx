import React, { useState, ChangeEvent, FormEvent } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { fetchCreateAdmin } from '../../store/feature/authSlice';
import { HumanResources } from '../../store';
import Swal from "sweetalert2";

interface FormData {
  email: string;
  password: string;
  token: string;
}

const UserForm: React.FC = () => {
    const dispatch = useDispatch<HumanResources>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(fetchCreateAdmin({
        email: email,
        password: password,
        token: localStorage.getItem('token') ?? ''
    })).then(() => {
      Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Admin Account Created.',
      });
  })
  .catch(() => {
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error creating new admin account. Please try again later.',
      });
  });
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
      }}
    >
      <TextField
        label="Email"
        name="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Password"
        name="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        fullWidth
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
};

export default UserForm;
