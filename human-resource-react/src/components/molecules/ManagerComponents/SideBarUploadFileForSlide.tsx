import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {Button, Container, Typography, Box, CircularProgress, IconButton, TextField} from "@mui/material";
import { fetchUploadFile } from "../../../store/feature/slideSlice";
import { HumanResources, useAppSelector } from "../../../store";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {Cloud, CloudUpload} from "@mui/icons-material";
import FileUploadComponent from "../../atoms/FileUploadComponent";

const FileUpload: React.FC = () => {
  const [fileMobile, setFileMobile] = useState<File | null>(null);
  const [fileDesktop, setFileDesktop] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useDispatch<HumanResources>();
  const [loading, setLoading] = useState(false);
  const [resetFiles, setResetFiles] = useState<boolean>(false);

  const[city, setCity] = useState('');
  const[district, setDistrict] = useState('');
  const[neighborhood, setNeighborhood] = useState('');
  const[projection, setProjection] = useState('');
  const[concept, setConcept] = useState('');

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
      formData.append("city", city);
      formData.append("district", district);
      formData.append("neighborhood", neighborhood);
      formData.append("projection", projection);
      formData.append("concept", concept);

      const result = await dispatch(fetchUploadFile({ token, formData })).unwrap();
      setMessage("Upload successful! " + (result.message || "Slides created."));
      setResetFiles(true);
      setCity('')
      setDistrict('')
      setNeighborhood('')
      setProjection('')
      setConcept('')

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

  React.useEffect(() => {
    if (resetFiles) {
      setResetFiles(false);
    }
  }, [resetFiles]);

  return (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography sx={{ textAlign: 'center' ,fontWeight: 'bold'}} variant="h4" component="h2" gutterBottom>
          Upload .zip Files
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <FileUploadComponent message="Mobile File:" onFileChange={setFileMobile} reset={resetFiles}/>
          <FileUploadComponent message="Desktop File:" onFileChange={setFileDesktop} reset={resetFiles}/>
          <TextField

              label="City"
              variant="outlined"
              onChange={(event) => setCity(event.target.value)}
              value={city}
              sx={{ marginTop: 3 }}
              fullWidth
              inputProps={{ maxLength: 50 }}
          />
          <TextField

              label="District"
              variant="outlined"
              onChange={(event) => setDistrict(event.target.value)}
              value={district}
              sx={{ marginTop: 3 }}
              fullWidth
              inputProps={{ maxLength: 50 }}
          />
          <TextField

              label="Neighborhood"
              variant="outlined"
              onChange={(event) => setNeighborhood(event.target.value)}
              value={neighborhood}
              sx={{ marginTop: 3 }}
              fullWidth
              inputProps={{ maxLength: 50 }}
          />
          <TextField

              label="Projection"
              variant="outlined"
              onChange={(event) => setProjection(event.target.value)}
              value={projection}
              sx={{ marginTop: 3 }}
              fullWidth
              inputProps={{ maxLength: 50 }}
          />
          <TextField

              label="Concept"
              variant="outlined"
              onChange={(event) => setConcept(event.target.value)}
              value={concept}
              sx={{ marginTop: 3 }}
              fullWidth
              inputProps={{ maxLength: 50 }}
          />
          <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !fileMobile || !fileDesktop || !city || !district || !neighborhood || !projection || !concept}
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
