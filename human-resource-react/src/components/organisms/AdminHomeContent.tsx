import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { month: 'Jan', customers: 30 },
  { month: 'Feb', customers: 45 },
  { month: 'Mar', customers: 60 },
  { month: 'Apr', customers: 80 },
  { month: 'May', customers: 100 },
  { month: 'Jun', customers: 120 },
  { month: 'Jul', customers: 140 },
  { month: 'Aug', customers: 160 },
  { month: 'Sep', customers: 180 },
  { month: 'Oct', customers: 200 },
  { month: 'Nov', customers: 220 },
  { month: 'Dec', customers: 240 },
];

const Dashboard = () => {
  const totalCustomers = 240; // Replace with dynamic data
  const totalDevelopers = 10; // Replace with dynamic data

  return (
    <Box p={4}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Total Customers
              </Typography>
              <Typography variant="h4" component="div">
                {totalCustomers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Total Developers
              </Typography>
              <Typography variant="h4" component="div">
                {totalDevelopers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Customers Acquired This Year
              </Typography>
              <LineChart width={500} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="customers" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
