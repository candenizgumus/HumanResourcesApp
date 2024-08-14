import React, {useState, FormEvent, useEffect} from 'react';
import {TextField, Button, Box, Grid, InputLabel, Select, MenuItem, FormControl, Avatar} from '@mui/material';
import {HumanResources, useAppSelector} from "../../../store";
import {useDispatch} from "react-redux";
import {
    fetchPersonalDocumentTypes,
    fetchSavePersonalDocument
} from "../../../store/feature/personalDocumentSlice";
import MyDropzone from "../../atoms/DropZone";


const AddDocument: React.FC = () => {


    const token = useAppSelector((state) => state.auth.token);
    const employeeId = useAppSelector((state) => state.auth.selectedEmployeeId);
    const dispatch = useDispatch<HumanResources>();
    const [documentType, setDocumentType] = useState([]);
    const [documentFile, setDocumentFile] = useState<string>('');
    const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);
    const [description, setDescription] = useState<string>('');

    const handleFilesAdded = (newFiles: File[]) => {
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
    };

    const handleFileRemoved = (fileToRemove: File) => {
        setFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
        // Ekstra işlemler burada yapılabilir
    };

    useEffect(() => {
        dispatch(fetchPersonalDocumentTypes(token))
            .then(data => {
                setDocumentType(data.payload);
            });
    }, [dispatch]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    const addDocument = () => {
        dispatch(fetchSavePersonalDocument({
            employeeId: employeeId,
            documentType: selectedDocumentType,
            documentFile: files,
            description: description,
            token: token
        }));
    };

    return (


        <Grid container spacing={2}>
            <Grid item xs={6}>
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
                    <FormControl required variant="outlined">
                        <InputLabel>{'Document Type'}</InputLabel>
                        <Select
                            value={selectedDocumentType}
                            onChange={event => setSelectedDocumentType(event.target.value as string)}
                            label="Document Type"
                        >
                            {documentType.map((documentType) => (
                                <MenuItem key={documentType} value={documentType}>
                                    {documentType}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        required
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Grid item style={{ width: 399, height:72  }}>
                        <MyDropzone
                            onFilesAdded={handleFilesAdded}
                            onFileRemoved={handleFileRemoved}
                        />
                    </Grid>
                    <Button onClick={addDocument} sx={{mt: 5}} type="button" variant="contained" color="primary">
                        Add Document
                    </Button>
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        maxWidth: 800,
                        margin: 'auto',
                        padding: 2,
                    }}
                >


                </Box>
            </Grid>
        </Grid>


    );
};

export default AddDocument;
