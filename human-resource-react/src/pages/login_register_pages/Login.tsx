import React, {useRef} from "react";
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import LoginCard from './LoginCard';
import Box from "@mui/material/Box";
import RegisterCard from "./RegisterCard";
import {AppBar, Button, Toolbar, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {NavBar} from "../../components/molecules/NavBar";

export default function Login() {
    // Create a ref for the Features section
    const featuresRef = useRef<HTMLDivElement>(null);
  return (
      <Grid

          container
          component="main"
          sx={{
              height: '90vh',
              backgroundColor: (t) =>
                  t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              justifyContent: 'center',
              alignItems: 'center',
          }}
      >
          <NavBar />
          <CssBaseline />
          <Grid item xs={12} sm={10} md={8} lg={6}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    maxWidth: 500,
                    width: '100%',
                    padding: 2,
                    boxSizing: 'border-box',
                }}>
              <Box
                  sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      maxWidth: 500,
                      width: '100%',
                      padding: 2,
                      boxSizing: 'border-box',
                  }}
              >
                  <LoginCard />
              </Box>
          </Grid>
      </Grid>

  );
}

