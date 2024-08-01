import { Divider, Paper, Stack, Typography } from '@mui/material';
import { useMemo, useRef, useState } from 'react';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { volumeVsService } from '../../../../data/volume-vs-service';
import { getTotal, numberFormat } from '../../../../helpers/utils';
import LegendToggleButton from '../../../../components/common/LegendToggleButton';
import VolumeVsServiceChart from './VolumeVsServiceChart';

const VolumeVsService = () => {
  const chartRef = useRef<EChartsReactCore | null>(null);
  const [legend, setLegend] = useState({
    volume: false,
    services: false,
  });

  const totalVolume = useMemo(() => getTotal(volumeVsService.volume), [volumeVsService.volume]);
  const totalServices = useMemo(
    () => getTotal(volumeVsService.services),
    [volumeVsService.services],
  );

  const handleLegendToggle = (name: keyof typeof legend) => {
    setLegend((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));

    if (chartRef.current) {
      const instance = chartRef.current.getEchartsInstance();
      instance.dispatchAction({
        type: 'legendToggleSelect',
        name,
      });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" color="primary.dark" mb={3}>
        Volume vs Service
      </Typography>

      <VolumeVsServiceChart
        chartRef={chartRef}
        data={volumeVsService}
        style={{ height: 182 }}
        sx={{ pb: 1 }}
      />

      <Stack
        direction="row"
        justifyContent="center"
        divider={<Divider orientation="vertical" flexItem sx={{ height: 24 }} />}
        sx={{ borderTop: 1, borderColor: 'grey.A100', pt: 2 }}
        gap={2.5}
      >
        <LegendToggleButton
          name="Volume"
          icon="codicon:circle-filled"
          value={numberFormat(totalVolume)}
          color="info.main"
          legend={legend}
          onHandleLegendToggle={handleLegendToggle}
        />
        <LegendToggleButton
          name="Services"
          icon="codicon:circle-filled"
          value={numberFormat(totalServices)}
          color="success.main"
          legend={legend}
          onHandleLegendToggle={handleLegendToggle}
        />
      </Stack>
    </Paper>
  );
};

export default VolumeVsService;
