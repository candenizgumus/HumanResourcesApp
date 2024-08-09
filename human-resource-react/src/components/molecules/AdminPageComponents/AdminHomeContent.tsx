import React, { useEffect } from 'react';
import {Box, Card, CardContent, Typography, Grid, Container} from '@mui/material';
import { useDispatch } from 'react-redux';
import { HumanResources } from '../../../store';
import { fetchGetCustomerByMonth } from '../../../store/feature/authSlice';
import {BarChart, Gauge, PieChart} from "@mui/x-charts";
import { AttachMoney, Engineering, Person } from "@mui/icons-material";



const Dashboard = () => {
  const totalCustomers = 240; // Replace with dynamic data
  const totalDevelopers = 10; // Replace with dynamic data
  const dispatch = useDispatch<HumanResources>();
  const [monthlyCustomerCount, setMonthlyCustomerCount] = React.useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchGetCustomerByMonth(token)).then(data => {
        setMonthlyCustomerCount(data.payload);
      });
    }
  }, [dispatch]);

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
      <Box sx={{ flexGrow: 1, marginLeft: 5, marginTop: 5 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ boxShadow: 7, borderRadius: 3, border: '2px solid #1976D2', background: 'linear-gradient(to right, #f0f4ff, #ffffff)' }}>
              <CardContent>
                <Grid container direction="row" justifyContent="space-between" alignItems="center">
                  <Grid item xs={4} textAlign="center">
                    <Person sx={{ fontSize: 80, color: '#1976D2' }} />
                  </Grid>
                  <Grid item xs={4} textAlign="center">
                    <Typography sx={{ fontWeight: 'bold', color: '#1976D2', marginBottom: 1 }} variant="h6">
                      Total Manager
                    </Typography>
                    <Typography sx={{ fontWeight: 'medium', fontSize: '1rem', color: '#1976D2' }} variant="h6">
                      250
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="center">
                    <Typography sx={{ fontWeight: 'bold', color: '#1976D2', marginBottom: 1 }} variant="h6">
                      Active Manager
                    </Typography>
                    <Typography sx={{ fontWeight: 'medium', fontSize: '1rem', color: '#1976D2' }} variant="h6">
                      25
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ boxShadow: 7, borderRadius: 3, border: '2px solid #4CAF50', background: 'linear-gradient(to right, #e0f2e9, #ffffff)' }}>
              <CardContent>
                <Grid container direction="row" justifyContent="space-between" alignItems="center">
                  <Grid item xs={4} textAlign="center">
                    <Engineering sx={{ fontSize: 80, color: '#4CAF50' }} />
                  </Grid>
                  <Grid item xs={4} textAlign="center">
                    <Typography sx={{ fontWeight: 'bold', color: '#388E3C', marginBottom: 1 }} variant="h6">
                      Total Employees
                    </Typography>
                    <Typography sx={{ fontWeight: 'medium', fontSize: '1rem', color: '#388E3C' }} variant="h6">
                      250
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="center">
                    <Typography sx={{ fontWeight: 'bold', color: '#388E3C', marginBottom: 1 }} variant="h6">
                      Active Employees
                    </Typography>
                    <Typography sx={{ fontWeight: 'medium', fontSize: '1rem', color: '#388E3C' }} variant="h6">
                      25
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ boxShadow: 7, borderRadius: 3, border: '2px solid #FFAA01', background: 'linear-gradient(to right, #fff4e5, #ffffff)' }}>
              <CardContent>
                <Grid container direction="row" justifyContent="space-between" alignItems="center">
                  <Grid item xs={4} textAlign="center">
                    <AttachMoney sx={{ fontSize: 80, color: '#FFAA01' }} />
                  </Grid>
                  <Grid item xs={4} textAlign="center">
                    <Typography sx={{ fontWeight: 'bold', color: '#FFAA01', marginBottom: 1 }} variant="h6">
                      Daily Turnover
                    </Typography>
                    <Typography sx={{ fontWeight: 'medium', fontSize: '1rem', color: '#FFAA01' }} variant="h6">
                      175 $
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="center">
                    <Typography sx={{ fontWeight: 'bold', color: '#FFAA01', marginBottom: 1 }} variant="h6">
                      Monthly Turnover
                    </Typography>
                    <Typography sx={{ fontWeight: 'medium', fontSize: '1rem', color: '#FFAA01' }} variant="h6">
                      25.000 $
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ marginTop: 5 }}>
          <Grid item xs={6}>
            <Card sx={{
              boxShadow: 7,
              borderRadius: 3,
              border: '2px solid #B39DDB', // A softer purple border color
              background: 'linear-gradient(to right, #EDE7F6, #D1C4E9)' // Light purple gradient background
            }}>
              <CardContent>
                <BarChart
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

          <Grid item xs={3}>
            <Card sx={{
              boxShadow: 7,
              borderRadius: 3,
              border: '2px solid #B39DDB',
              background: 'linear-gradient(to right, #EDE7F6, #D1C4E9)'
            }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' , textAlign: 'center'}}>
                <PieChart
                    series={[
                      {
                        data: [
                          { id: 0, value: 20, label: 'Manager' },
                          { id: 1, value: 400, label: 'Employee' },

                        ],
                        innerRadius: 30,
                        outerRadius: 100,
                        paddingAngle: 5,
                        cornerRadius: 5,
                        startAngle: -180,
                        endAngle: 180,
                        cx: 150,
                        cy: 150,
                        arcLabel: (item) => `(${item.value})`,
                      },
                    ]}

                    height={300}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={3}>
            <Card sx={{
              boxShadow: 7,
              borderRadius: 3,
              border: '2px solid #B39DDB',
              background: 'linear-gradient(to right, #EDE7F6, #D1C4E9)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: 2 // Add some padding to the content
              }}>
                <Typography sx={{ fontWeight: 'bold', color: '#B39DDB' }} variant="h6">
                  20 % Offer Return Ratio
                </Typography>
                <Gauge height={265} value={20} />
              </CardContent>
            </Card>
          </Grid>





        </Grid>




      </Box>
  );
};

export default Dashboard;
