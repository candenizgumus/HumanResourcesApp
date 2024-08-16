import React, {useState, FormEvent, useEffect} from 'react';
import {TextField, Button, Box, Grid, InputLabel, Select, MenuItem, FormControl, Avatar} from '@mui/material';
import {HumanResources, useAppSelector} from "../../../store";
import {useDispatch} from "react-redux";
import {
    fetchPersonalDocumentTypes,
    fetchSavePersonalDocument
} from "../../../store/feature/personalDocumentSlice";
import MyDropzone from "../../atoms/DropZone";
import Swal from "sweetalert2";
import sweetalert2 from "sweetalert2";


const AddDocument: React.FC = () => {


    const token = useAppSelector((state) => state.auth.token);
    const employeeId = useAppSelector((state) => state.auth.selectedEmployeeId);
    const dispatch = useDispatch<HumanResources>();
    const [documentType, setDocumentType] = useState([]);
    const [documentFile, setDocumentFile] = useState<string>('');
    const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState(false);


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
        if (selectedDocumentType === '' || files.length === 0 || description === '') {
            Swal.fire({
                icon: 'error',
                text: 'Please fill all the fields!',
                confirmButtonColor: '#1976D2',
            });
            return;
        }

        setLoading(true)

        dispatch(fetchSavePersonalDocument({
            employeeId: employeeId,
            documentType: selectedDocumentType,
            documentFile: files,
            description: description,
            token: token
        }))
            .then((data) => {
                if (data.payload.message) {
                    Swal.fire({
                        icon: 'error',
                        text: data.payload.message ?? 'Failed to add document',
                        showConfirmButton: true,
                        confirmButtonColor: '#1976D2',
                    })

                } else {
                    Swal.fire({
                        icon: 'success',
                        text: 'Document has been added',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
            .finally(() => {
                setLoading(false);
            });
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
                    <Grid item style={{width: 399, height: 72, marginBottom: 5}}>
                        <MyDropzone
                            onFilesAdded={handleFilesAdded}
                            onFileRemoved={handleFileRemoved}
                        />
                    </Grid>
                    <Grid item style={{marginBottom: 5}}></Grid>
                        <Button
                        onClick={addDocument}
                        sx={{mt: 5}}
                        type="button"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? "Adding Document..." : "Add Document"}
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
