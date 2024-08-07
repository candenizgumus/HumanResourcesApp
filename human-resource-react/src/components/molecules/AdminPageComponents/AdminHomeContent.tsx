import React, {useEffect} from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useDispatch } from 'react-redux';
import { HumanResources } from '../../../store';
import { fetchGetCustomerByMonth} from '../../../store/feature/authSlice';
import {BarChart} from "@mui/x-charts";


const Dashboard = () => {
  const totalCustomers = 240; // Replace with dynamic data
  const totalDevelopers = 10; // Replace with dynamic data
  const dispatch = useDispatch<HumanResources>();
  const [monthlyCustomerCount , setMonthlyCustomerCount] = React.useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchGetCustomerByMonth(token)).then(data => {
        setMonthlyCustomerCount(data.payload)
      })
    }
  }, []);

  const data = [
    { month: 'Jan', customers: monthlyCustomerCount[0] },
    { month: 'Feb', customers: monthlyCustomerCount[1] },
    { month: 'Mar', customers: monthlyCustomerCount[2] },
    { month: 'Apr', customers: monthlyCustomerCount[3] },
    { month: 'May', customers: monthlyCustomerCount[4] },
    { month: 'Jun', customers: monthlyCustomerCount[5] },
    { month: 'Jul', customers: monthlyCustomerCount[6] },
    { month: 'Aug', customers: monthlyCustomerCount[7] },
    { month: 'Sep', customers: monthlyCustomerCount[8] },
    { month: 'Oct', customers: monthlyCustomerCount[9] },
    { month: 'Nov', customers: monthlyCustomerCount[10] },
    { month: 'Dec', customers: monthlyCustomerCount[11] },
  ];

  return (

      <Grid sx = {{ marginLeft: 5 }} container spacing={4}>
        <Grid item xs={3} md={6} lg={4}>
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
        <Grid item xs={3} md={6} lg={4}>
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
        <Grid sx={{ marginTop: 5 }} container spacing={4}>
          <Grid item xs={6}>

            <Card>
              <CardContent>

                <BarChart sx = {{ width: "100%" }}
                    xAxis={[
                      {
                        scaleType: 'band',
                        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        label: 'Month'
                      }
                    ]}
                    yAxis={[
                      {
                        label: 'Customer Count'
                      }
                    ]}
                    series={[{ data: monthlyCustomerCount }]}
                    height={300}
                />


              </CardContent>
            </Card>
          </Grid>
        </Grid>
        </Grid>


  );
};

export default Dashboard;
