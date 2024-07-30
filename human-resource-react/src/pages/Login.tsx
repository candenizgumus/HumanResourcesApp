
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import federerserve from '../../images/federerserve.jpg';
import LoginCard from './LoginCard';


export default function Login() {

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage:
            `url(${federerserve})`,
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'left',
        }}
      />
      <LoginCard />
    </Grid>

  );
}

