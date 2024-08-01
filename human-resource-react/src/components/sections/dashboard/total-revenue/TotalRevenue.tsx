import { Paper, Typography } from '@mui/material';
import TotalRevenueChart from './TotalRevenueChart';
import { totalRevenue } from 'data/total-revenue';

const TotalRevenue = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        Total Revenue
      </Typography>

      <TotalRevenueChart data={totalRevenue} style={{ height: 247 }} />
    </Paper>
  );
};

export default TotalRevenue;
