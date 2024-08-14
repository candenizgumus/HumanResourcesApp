import { FileDownload } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { fetchDownloadFile} from "../../store/feature/expenditureSlice";
import { HumanResources, useAppSelector } from "../../store";
import { useDispatch } from "react-redux";

const DownloadButtonFromS3: React.FC<{ fileKey: string }> = ({ fileKey }) => {
    const dispatch = useDispatch<HumanResources>();
    const user = useAppSelector((state) => state.auth.user);
    const token = useAppSelector((state) => state.auth.token);


    const handleDownload = async () => {
        try {
            const presignedUrl = await dispatch(fetchDownloadFile({
                email: user.email,
                fileName: fileKey,
                token: token
            }));

            console.log('Presigned URL:', presignedUrl);

            // Create a link element
            const link = document.createElement('a');
            link.href = presignedUrl.payload.url;
            link.download = fileKey; // Optional, specify the filename
            document.body.appendChild(link);

            // Trigger the download
            link.click();

            // Clean up
            document.body.removeChild(link);

        } catch (error) {
            console.error('Failed to download file:', error);
        }

    };

    return (
        <IconButton color="primary" onClick={handleDownload}>
            <FileDownload />
        </IconButton>
    );
};

export default DownloadButtonFromS3;