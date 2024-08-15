import React, { useState, ChangeEvent, FormEvent } from 'react';
import { TextField, Button, Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { fetchCreateUserWithUserType } from '../../../store/feature/authSlice';
import { HumanResources } from '../../../store';
import Swal from "sweetalert2";
import { fetchCreateFeature } from '../../../store/feature/featureSlice';

const UserForm: React.FC = () => {
  const dispatch = useDispatch<HumanResources>();
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [iconPath, setIconPath] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    try {
      let result = await dispatch(fetchCreateFeature({
        name: name,
        shortDescription: shortDescription,
        iconPath: iconPath,
        token: localStorage.getItem('token') ?? ''
      })).unwrap();
  
      if (result.code) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message,
        });
        setLoading(false);
        return; // Stop the process and prevent further then block executions
      }
  
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Feature Created.',
      });
  
      setLoading(false);
    } catch (error) {
      console.error("Error creating feature:", error);
      Swal.fire("Error", "There was a problem creating feature.", "error");
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
      }}
    >
      <TextField
        label="Feature Name"
        name="name"
        value={name}
        onChange={e => setName(e.target.value)}
        fullWidth
        required
        inputProps={{ maxLength: 64 }}
      />
      <TextField
        label="Short Description"
        name="shortDescription"
        value={shortDescription}
        onChange={e => setShortDescription(e.target.value)}
        fullWidth
        multiline
        rows={4}
        required
        inputProps={{ maxLength: 80 }}
      />
      <TextField
        label="Icon Path"
        name="iconPath"
        value={iconPath}
        onChange={e => setIconPath(e.target.value)}
        fullWidth
        required
        inputProps={{ maxLength: 64 }}
      />
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? "Processing..." : "Create"}
      </Button>
    </Box>
  );
};

export default UserForm;
