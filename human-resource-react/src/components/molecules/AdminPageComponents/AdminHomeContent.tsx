import React, { useEffect } from 'react';
import {Box, Card, CardContent, Typography, Grid, Container} from '@mui/material';
import { useDispatch } from 'react-redux';
import { HumanResources } from '../../../store';
import {fetchCountOfUsersForAdminMenu, fetchGetCustomerByMonth} from '../../../store/feature/authSlice';
import {BarChart, Gauge, PieChart} from "@mui/x-charts";
import { AttachMoney, Engineering, Person } from "@mui/icons-material";



const Dashboard = () => {
  const [totalManager, setTotalManager] = React.useState(0);
  const [totalEmployee, setTotalEmployee] = React.useState(0);
  const [activeManager, setActiveManager] = React.useState(0);
  const [activeEmployee, setActiveEmployee] = React.useState(0);
  const[totalOffer, setTotalOffer] = React.useState(0);
  const[totalApprovedOffer, setTotalApprovedOffer] = React.useState(0);
  const[offerReturnRatio, setOfferReturnRatio] = React.useState(0.00);

  const dispatch = useDispatch<HumanResources>();
  const [monthlyCustomerCount, setMonthlyCustomerCount] = React.useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchGetCustomerByMonth(token)).then(data => {
        setMonthlyCustomerCount(data.payload);
      });

      dispatch(fetchCountOfUsersForAdminMenu(token)).then(data => {
        setTotalManager(data.payload.totalManager);
        setTotalEmployee(data.payload.totalEmployee);
        setActiveManager(data.payload.activeManager);
        setActiveEmployee(data.payload.activeEmployee);
        setTotalOffer(data.payload.totalOffer);
        setTotalApprovedOffer(data.payload.approvedOffer);

        // Calculate and set offer return ratio
        const ratio = data.payload.totalOffer > 0 ? data.payload.approvedOffer / data.payload.totalOffer : 0;
        setOfferReturnRatio(ratio);
      });
    }
  }, [dispatch]);

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
                      Total <br/> Manager
                    </Typography>
                    <Typography sx={{ fontWeight: 'medium', fontSize: '1rem', color: '#1976D2' }} variant="h6">
                      {totalManager}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="center">
                    <Typography sx={{ fontWeight: 'bold', color: '#1976D2', marginBottom: 1 }} variant="h6">
                      Active <br/> Manager
                    </Typography>
                    <Typography sx={{ fontWeight: 'medium', fontSize: '1rem', color: '#1976D2' }} variant="h6">
                      {activeManager}
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
                      Total <br/> Employees
                    </Typography>
                    <Typography sx={{ fontWeight: 'medium', fontSize: '1rem', color: '#388E3C' }} variant="h6">
                      {totalEmployee}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="center">
                    <Typography sx={{ fontWeight: 'bold', color: '#388E3C', marginBottom: 1 }} variant="h6">
                      Active <br/> Employees
                    </Typography>
                    <Typography sx={{ fontWeight: 'medium', fontSize: '1rem', color: '#388E3C' }} variant="h6">
                      {activeEmployee}
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
                      Daily <br/> Turnover
                    </Typography>
                    <Typography sx={{ fontWeight: 'medium', fontSize: '1rem', color: '#FFAA01' }} variant="h6">
                      175 $
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="center">
                    <Typography sx={{ fontWeight: 'bold', color: '#FFAA01', marginBottom: 1 }} variant="h6">
                      Monthly <br/> Turnover
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
          <Grid item xs={5.5}>
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
                    barLabel="value"
                    series={[{ data: monthlyCustomerCount }]}
                    height={300}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={3.5}>
            <Card sx={{
              boxShadow: 7,
              borderRadius: 3,
              border: '2px solid #89CBC4', // Updated border color
              background: 'linear-gradient(to right, #E0F2F1, #80CBC4)' // Updated gradient
            }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' , textAlign: 'center'}}>
                <PieChart
                    series={[
                      {
                        data: [
                          { id: 0, value: totalManager, label: 'Manager' },
                          { id: 1, value: totalEmployee, label: 'Employee' },

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
              border: '2px solid #FFB3B3', // Lighter border color
              background: 'linear-gradient(to right, #FFE5E5, #FFB3B3)', // Very light gradient with soft pink tones
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
                <Typography  variant="h6">
                  { Math.round(offerReturnRatio*100) === 0 ? '0' : Math.round(offerReturnRatio*100)} % Offer Return Ratio
                </Typography>
                <Gauge height={265} value={Math.round(offerReturnRatio*100) ?? '0'} />
              </CardContent>
            </Card>
          </Grid>





        </Grid>




      </Box>
  );
};

export default Dashboard;
