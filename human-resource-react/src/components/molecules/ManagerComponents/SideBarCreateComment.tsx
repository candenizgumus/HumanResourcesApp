import React, { useState, FormEvent, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { HumanResources, useAppSelector } from '../../../store';
import Swal from "sweetalert2";
import { fetchGetUserStory, fetchUpdateUserStories, IUserStory } from '../../../store/feature/userStorySlice';

const UserForm: React.FC = () => {
  const dispatch = useDispatch<HumanResources>();
  const [longDescription, setLongDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [setNewManager, setSetNewManager] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = useAppSelector((state) => state.auth.token);
  const companyStory: IUserStory = useAppSelector((state) => state.userStory.companyStory);

  const setUserInfos = async () => {
    try {
      const result = await dispatch(fetchGetUserStory(token)).unwrap();

      setLongDescription(result.payload.longDescription ?? '');
      setShortDescription(result.payload.shortDescription ?? '');
    } catch (error) {
      console.error('Error in setUserInfos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUserInfos();
  }, [token]);

  useEffect(() => {
    if (companyStory && !loading) {
      setLongDescription(companyStory.longDescription ?? '');
      setShortDescription(companyStory.shortDescription ?? '');
    }
  }, [companyStory, loading]);



  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    let result = await dispatch(fetchUpdateUserStories({
      longDescription: longDescription,
      shortDescription: shortDescription,
      token: token ?? '',
      setNewManager: setNewManager

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
  };

  return (
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
        label="Short Comment"
        name="shortDescription"
        value={shortDescription}
        onChange={e => setShortDescription(e.target.value)}
        fullWidth
        required
        multiline
        rows={4}
        inputProps={{ maxLength: 255 }}
      />
      <TextField
        label="Full Comment"
        name="longDescription"
        value={longDescription}
        onChange={e => setLongDescription(e.target.value)}
        fullWidth
        multiline
        rows={20}
        required
        inputProps={{ maxLength: 1500 }}
      />
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? "Processing..." : "Create"}
      </Button>
    </Box>
  );
};

export default UserForm;
