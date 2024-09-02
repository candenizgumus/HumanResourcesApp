import { useDropzone } from 'react-dropzone';
import { useEffect, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloudUpload from '@mui/icons-material/CloudUpload';

interface FileUploadComponentProps {
  onFileChange: (file: File) => void;
  message: string;
  reset: boolean;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ onFileChange,message,reset }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      onFileChange(selectedFile);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileChange,
    accept: { 'application/zip': ['.zip'] },
    maxFiles: 1,
  });

  useEffect(() => {
    if (reset) {
      setFile(null);
    }
  }, [reset]);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="body1" gutterBottom>
        {message}
      </Typography>
      <Box
        {...getRootProps()}
        sx={{
          display: 'flex',
          alignItems: 'center',
          mt: 1,
          border: '3px dashed grey',
          p: 2,
          borderRadius: 1,
          cursor: 'pointer',
        }}
      >
        <input {...getInputProps()} />
        <IconButton 
          color="primary" 
          component="span" 
          sx={{
            pointerEvents: 'none',
          }}
        >
          <CloudUpload />
        </IconButton>
        <Typography variant="body2" sx={{ ml: 2 }}>
          {file ? file.name : 'No file selected'}
        </Typography>
      </Box>
    </Box>
  );
};

export default FileUploadComponent;
