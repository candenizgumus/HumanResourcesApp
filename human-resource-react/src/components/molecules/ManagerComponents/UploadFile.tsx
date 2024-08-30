import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Container, Typography, Box, TextField, CircularProgress } from "@mui/material";
import { fetchUploadFile } from "../../../store/feature/slideSlice";
import { HumanResources, useAppSelector } from "../../../store";

const FileUpload: React.FC = () => {
  const [fileMobile, setFileMobile] = useState<File | null>(null);
  const [fileDesktop, setFileDesktop] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useDispatch<HumanResources>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!fileMobile || !fileDesktop) {
      setMessage("Please select both files to upload.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("fileMobile", fileMobile);
      formData.append("fileDesktop", fileDesktop);

      const result = await dispatch(fetchUploadFile({ token, formData })).unwrap();
      setMessage("Upload successful! " + (result.message || "Slides created."));
    } catch (error) {
      setMessage("Failed to upload files. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChangeMobile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileMobile(event.target.files[0]);
    }
  };

  const handleFileChangeDesktop = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileDesktop(event.target.files[0]);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Upload Zip Files
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" gutterBottom>
            Mobile File:
          </Typography>
          <TextField
            type="file"
            onChange={handleFileChangeMobile}
            inputProps={{ accept: ".zip" }}
            fullWidth
          />
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" gutterBottom>
            Desktop File:
          </Typography>
          <TextField
            type="file"
            onChange={handleFileChangeDesktop}
            inputProps={{ accept: ".zip" }}
            fullWidth
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || !fileMobile || !fileDesktop}
          sx={{ mt: 3 }}
          fullWidth

        >
          Upload
        </Button>
      </Box>
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <CircularProgress />
        </Box>
      )}
      {message && (
        <Typography variant="body1" color="textSecondary" sx={{ mt: 3 }}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default FileUpload;
