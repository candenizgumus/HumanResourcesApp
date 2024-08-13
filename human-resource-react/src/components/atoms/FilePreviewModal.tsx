import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography, Button } from '@mui/material';
import { FileDownload } from '@mui/icons-material';

interface FilePreviewModalProps {
    open: boolean;
    onClose: () => void;
    fileUrl: string;
    fileName: string;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ open, onClose, fileUrl, fileName }) => {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>File Preview</DialogTitle>
            <DialogContent>
                <div style={{ textAlign: 'center' }}>
                    <Typography variant="h6">{fileName}</Typography>
                    <iframe src={fileUrl} style={{ width: '100%', height: '500px' }} title="File Preview" />
                    <Button variant="contained" color="primary" onClick={handleDownload} style={{ marginTop: '16px' }}>
                        <FileDownload /> Download
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FilePreviewModal;