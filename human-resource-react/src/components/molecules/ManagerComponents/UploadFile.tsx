import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Container, Typography, Box, TextField } from "@mui/material";
import { fetchUploadFile } from "../../../store/feature/slideSlice";
import { HumanResources, useAppSelector } from "../../../store";
import MyDropzone from "../../atoms/DropZone";
import SlideComponent from "./SlideComponent";

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string>("");
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useDispatch<HumanResources>();

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const handleFileRemoved = (fileToRemove: File) => {
    setFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (files.length === 0) {
      setMessage("Please select a file to upload.");
      return;
    }

    try {
      const result = await dispatch(fetchUploadFile({ token, files })).unwrap();
      setMessage("Upload successful! " + (result.message || "Slides created."));
    } catch (error) {
      setMessage("Failed to upload file. Please try again.");
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Upload a Zip File
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <MyDropzone
          onFilesAdded={handleFilesAdded}
          onFileRemoved={handleFileRemoved}
        />
        <Button type="submit" variant="contained" color="primary">
          Upload
        </Button>
      </Box>
      {message && (
        <Typography variant="body1" color="textSecondary" sx={{ mt: 3 }}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default FileUpload;
