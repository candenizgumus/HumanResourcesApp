import React, { useState, ChangeEvent, FormEvent } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { fetchSaveDefinition } from '../../store/feature/definitionSlice';
import { EDefinitionType } from '../../models/IDefinitionType';
import Swal from "sweetalert2";
import { HumanResources } from '../../store';

const UserForm: React.FC = () => {
  const dispatch = useDispatch<HumanResources>();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [definitionType, setDefinitionType] = useState<EDefinitionType | ''>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    try {
      let result = await dispatch(fetchSaveDefinition({
        name: name.toUpperCase(),
        definitionType: definitionType as EDefinitionType, // Cast to EDefinitionType
        token: localStorage.getItem('token') ?? ''
      })).unwrap();

      if (result.code) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message,
        });
        setLoading(false);
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Definition Created.',
      });

      setLoading(false);
    } catch (error) {
      console.error("Error creating definition:", error);
      Swal.fire("Error", "There was a problem creating definition.", "error");
    }
  };

  const handleDefinitionTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedValue = e.target.value;

    // Cast to unknown first, then to EDefinitionType
    setDefinitionType(selectedValue as unknown as EDefinitionType);
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
        onChange={handleDefinitionTypeChange as any} // Type casting here
        required
        fullWidth
        SelectProps={{ native: true }}
      >
        {Object.values(EDefinitionType).map((value) => (
          <option key={value} value={value}>
            {value}
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
