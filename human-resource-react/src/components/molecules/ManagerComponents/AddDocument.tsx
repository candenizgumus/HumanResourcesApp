import React, { useState, useEffect, FormEvent } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, Button, Box, Grid, InputLabel, Select, MenuItem, 
    FormControl, CircularProgress
} from '@mui/material';
import { useDispatch } from "react-redux";
import { HumanResources, useAppSelector } from "../../../store";
import {
    fetchPersonalDocumentTypes,
    fetchSavePersonalDocument
} from "../../../store/feature/personalDocumentSlice";
import MyDropzone from "../../atoms/DropZone";
import Swal from "sweetalert2";

const AddDocument: React.FC<{ open: boolean, onClose: () => void }> = ({ open, onClose }) => {
    const token = useAppSelector((state) => state.auth.token);
    const employeeId = useAppSelector((state) => state.auth.selectedEmployeeId);
    const dispatch = useDispatch<HumanResources>();

    const [documentType, setDocumentType] = useState<string[]>([]);
    const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchPersonalDocumentTypes(token))
            .then(data => setDocumentType(data.payload));
    }, [dispatch, token]);

    const handleFilesAdded = (newFiles: File[]) => {
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
    };

    const handleFileRemoved = (fileToRemove: File) => {
        setFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (selectedDocumentType === '' || files.length === 0 || description === '') {
            Swal.fire({
                icon: 'error',
                text: 'Please fill all the fields!',
                confirmButtonColor: '#1976D2',
            });
            return;
        }

        setLoading(true);
        dispatch(fetchSavePersonalDocument({
            employeeId,
            documentType: selectedDocumentType,
            documentFile: files,
            description,
            token,
        })).then((data) => {
            if (data.payload.message) {
                Swal.fire({
                    icon: 'error',
                    text: data.payload.message ?? 'Failed to add document',
                    confirmButtonColor: '#1976D2',
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    text: 'Document has been added',
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        }).finally(() => {
            setLoading(false);
            onClose();
        });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
            <DialogTitle>Add Document</DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} mt={2}>
                    <FormControl required fullWidth>
                        <InputLabel>Document Type</InputLabel>
                        <Select
                            value={selectedDocumentType}
                            onChange={event => setSelectedDocumentType(event.target.value as string)}
                            label="Document Type"
                        >
                            {documentType.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        required
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Grid item mt={2}>
                        <MyDropzone
                            onFilesAdded={handleFilesAdded}
                            onFileRemoved={handleFileRemoved}
                        />
                    </Grid>
                    {loading && (
                        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                            <CircularProgress />
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={onClose} color="error" sx={{ marginRight: '17px', width: '100px' }}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary" disabled={loading} variant="contained" sx={{ marginRight: '17px', width: '100px' }}>
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddDocument;
