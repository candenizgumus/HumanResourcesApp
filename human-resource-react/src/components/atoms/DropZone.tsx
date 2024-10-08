import { DeleteForeverRounded } from '@mui/icons-material';
import { IconButton, Paper, Typography } from '@mui/material'
import React, { useCallback, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface MyDropzoneProps {
    onFilesAdded: (files: File[]) => void;
    onFileRemoved: (file: File) => void;  // Yeni prop
}

export default function MyDropzone({ onFilesAdded, onFileRemoved }: MyDropzoneProps) {
    const [files, setFiles] = useState<File[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropzoneRef = useRef<HTMLDivElement>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
        onFilesAdded(acceptedFiles);
    }, [onFilesAdded]);

    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleRemoveFile = (fileToRemove: File, event: React.MouseEvent) => {
        event.stopPropagation();
        setFiles(prevFiles => {
            const updatedFiles = prevFiles.filter(file => file !== fileToRemove);
            onFileRemoved(fileToRemove);  // Dosya silindiğinde çağrılacak
            return updatedFiles;
        });
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true });

    return (
        <Paper
            ref={dropzoneRef}
            {...getRootProps({ onClick: handleClick })}
            style={{
                border: '2px dashed #cccccc',
                borderRadius: '9px',
                padding: '20px',
                textAlign: 'center'
            }}
            elevation={0}
        >
            <input
                {...getInputProps()}
                ref={inputRef}
                style={{ display: 'none' }}
                onChange={(e) => {
                    if (e.target.files) {
                        onDrop(Array.from(e.target.files));
                    }
                }}
            />
            <Typography variant="body1">
                {isDragActive
                    ? 'Add documents'
                    : 'Drag \'n\' drop files here, or click to select files'}
            </Typography>
            <ul style={{ listStyleType: 'none', padding: 0, marginTop: '10px' }}>
                {files.map((file, index) => (
                    <li
                        key={index}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '3px',
                        }}
                    >
                        <Typography variant="body2" style={{ flexGrow: 1 }}>
                            {file.name}
                        </Typography>
                        <IconButton
                            onClick={(event) => handleRemoveFile(file, event)}
                            color="error"
                            style={{ marginLeft: '10px' }}
                        >
                            <DeleteForeverRounded />
                        </IconButton>
                    </li>
                ))}
            </ul>
        </Paper>
    );
}
