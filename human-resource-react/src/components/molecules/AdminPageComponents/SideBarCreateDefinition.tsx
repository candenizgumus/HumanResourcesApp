import React, { useState, ChangeEvent, FormEvent } from 'react';
import { TextField, Button, Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { fetchCreateUserWithUserType } from '../../../store/feature/authSlice';
import { HumanResources } from '../../../store';
import Swal from "sweetalert2";
import { fetchCreateFeature } from '../../../store/feature/featureSlice';
import { fetchSaveDefinition } from '../../../store/feature/definitionSlice';
import { EDefinitionType } from '../../../models/IDefinitionType';

const UserForm: React.FC = () => {
  const dispatch = useDispatch<HumanResources>();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [definitionType, setDefinitionType] = useState<EDefinitionType>(EDefinitionType.LEAVE_TYPE);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    try {
      let result = await dispatch(fetchSaveDefinition({
        name: name.toUpperCase(),
        definitionType: definitionType,
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

  const handleDefinitionTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDefinitionType(EDefinitionType[e.target.value as keyof typeof EDefinitionType]);
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
          select
          label="Definition Type"
          value={definitionType}
          onChange={handleDefinitionTypeChange}
          required
          fullWidth
          SelectProps={{ native: true }}
      >
          {Object.keys(EDefinitionType)
          .filter((key) => isNaN(Number(key))) // Filter out the numeric keys
          .map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
      </TextField>
      <TextField
        label="Definition Name"
        name="name"
        value={name}
        onChange={e => setName(e.target.value)}
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
