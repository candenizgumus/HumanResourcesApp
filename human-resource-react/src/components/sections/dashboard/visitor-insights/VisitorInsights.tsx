import { Paper, Stack, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { visitorInsightsData } from 'data/visitor-insights-data';
import LegendToggleButton from 'components/common/LegendToggleButton';
import VisitorInsightsChart from './VisitorInsightsChart';

const VisitorInsights = () => {
  const chartRef = useRef<EChartsReactCore | null>(null);

  const [legend, setLegend] = useState({
    'loyal customers': false,
    'new customers': false,
    'unique customers': false,
  });

  const handleLegendToggle = (name: keyof typeof legend) => {
    setLegend((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));

    if (chartRef.current) {
      const instance = chartRef.current.getEchartsInstance();
      instance.dispatchAction({
        type: 'legendToggleSelect',
        name: name,
      });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" color="primary.dark" mb={4}>
        Visitor Insights
      </Typography>

      <VisitorInsightsChart
        chartRef={chartRef}
        data={visitorInsightsData}
        style={{ height: 176 }}
      />

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="center"
        alignItems="flex-start"
        mt={4}
        px={{ xs: 0, sm: 1, lg: 0 }}
        rowGap={1}
        columnGap={{ sm: 1, md: 0.5, lg: 1, xl: 0.5 }}
      >
        <LegendToggleButton
          name="Loyal Customers"
          icon="ic:round-square"
          color="secondary.darker"
          legend={legend}
          onHandleLegendToggle={handleLegendToggle}
        />

        <LegendToggleButton
          name="New Customers"
          icon="ic:round-square"
          color="error.darker"
          legend={legend}
          onHandleLegendToggle={handleLegendToggle}
        />

        <LegendToggleButton
          name="Unique Customers"
          icon="ic:round-square"
          color="success.darker"
          legend={legend}
          onHandleLegendToggle={handleLegendToggle}
        />
      </Stack>
    </Paper>
  );
};

export default VisitorInsights;
