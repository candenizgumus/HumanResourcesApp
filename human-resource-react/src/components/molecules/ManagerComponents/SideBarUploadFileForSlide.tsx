import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Container, Typography, Box, CircularProgress, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { fetchUploadFile, fetchUploadFileForSlide, ISlide } from "../../../store/feature/slideSlice";
import { HumanResources, useAppSelector } from "../../../store";
import FileUploadComponent from "../../atoms/FileUploadComponent";
import SlideArrangeComponent from "../../atoms/SlideArrangeComponent";

const initialSlideData: ISlide = {
  id: 0,
  companyId: 0,
  companyName: '',
  mobileImageUrls: [],
  desktopImageUrls: [],
  city: '',
  district: '',
  neighborhood: '',
  projection: '',
  concept: ''
};

const FileUpload: React.FC = () => {
  const [fileMobile, setFileMobile] = useState<File | null>(null);
  const [fileDesktop, setFileDesktop] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useDispatch<HumanResources>();
  const [loading, setLoading] = useState(false);
  const [resetFiles, setResetFiles] = useState<boolean>(false);

  const [slideData, setSlideData] = useState<ISlide>(initialSlideData);
  const [dialogStep, setDialogStep] = useState<number>(0); //dialog states

  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [projection, setProjection] = useState('');
  const [concept, setConcept] = useState('');

  const handleInitialUpload = async (event: React.FormEvent) => {
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

      const result = await dispatch(fetchUploadFileForSlide({ token, formData })).unwrap();
      setSlideData(result);
      setDialogStep(1); // Open the first dialog
    } catch (error) {
      setMessage("Failed to upload files. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMobileImages = (updatedMobileImageUrls: string[]) => {
    setSlideData((prevData) => ({ ...prevData, mobileImageUrls: updatedMobileImageUrls }));
  };
  
  const handleUpdateDesktopImages = (updatedDesktopImageUrls: string[]) => {
    setSlideData((prevData) => ({ ...prevData, desktopImageUrls: updatedDesktopImageUrls }));
  };

  const handleFinalUpload = async () => {
    if (!slideData || !city || !district || !neighborhood || !projection || !concept) {
      setMessage("Please complete all required fields.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("city", city);
      formData.append("district", district);
      formData.append("neighborhood", neighborhood);
      formData.append("projection", projection);
      formData.append("concept", concept);

      slideData.mobileImageUrls.forEach((url) => {
        formData.append("mobileImageUrls", url);
      });
      
      slideData.desktopImageUrls.forEach((url) => {
        formData.append("desktopImageUrls", url);
      });

      const result = await dispatch(fetchUploadFile({ token, formData })).unwrap();
      setMessage("Upload successful! " + (result.message || "Slides created."));
      setResetFiles(true);
      setCity('');
      setDistrict('');
      setNeighborhood('');
      setProjection('');
      setConcept('');
      setDialogStep(0);
    } catch (error) {
      setMessage("Failed to upload slides. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (resetFiles) {
      setResetFiles(false);
    }
  }, [resetFiles]);

  const handleNext = () => {
    setDialogStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setDialogStep((prevStep) => prevStep - 1);
  };

  const handleCloseDialog = () => {
    setDialogStep(0);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }} variant="h4" component="h2" gutterBottom>
        Upload .zip Files
      </Typography>
      <Box component="form" onSubmit={handleInitialUpload} noValidate>
        <FileUploadComponent message="Mobile File:" onFileChange={setFileMobile} reset={resetFiles} />
        <FileUploadComponent message="Desktop File:" onFileChange={setFileDesktop} reset={resetFiles} />
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

      {/* Mobile Image Dialog */}
      <Dialog open={dialogStep === 1} onClose={handleCloseDialog}>
        <DialogTitle>Arrange Mobile Images</DialogTitle>
        <DialogContent>
          <SlideArrangeComponent
            imageUrls={slideData.mobileImageUrls}
            onUpdateImages={handleUpdateMobileImages}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleNext} color="primary">
            Next
          </Button>
        </DialogActions>
      </Dialog>

      {/* Desktop Image Dialog */}
      <Dialog open={dialogStep === 2} onClose={handleCloseDialog}>
        <DialogTitle>Arrange Desktop Images</DialogTitle>
        <DialogContent>
          <SlideArrangeComponent
            imageUrls={slideData.desktopImageUrls}
            onUpdateImages={handleUpdateDesktopImages}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePrevious} color="primary">
            Previous
          </Button>
          <Button onClick={handleNext} color="primary">
            Next
          </Button>
        </DialogActions>
      </Dialog>

      {/* Description Dialog */}
      <Dialog open={dialogStep === 3} onClose={handleCloseDialog}>
        <DialogTitle>Slide Description</DialogTitle>
        <DialogContent>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePrevious} color="primary">
            Previous
          </Button>
          <Button onClick={handleFinalUpload} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FileUpload
