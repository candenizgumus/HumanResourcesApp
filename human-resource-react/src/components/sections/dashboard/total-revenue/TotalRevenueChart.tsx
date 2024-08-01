import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption,
} from 'echarts/components';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { useTheme } from '@mui/material';
import { useMemo } from 'react';
import ReactEchart from 'components/base/ReactEhart';
import { useBreakpoints } from 'providers/BreakpointsProvider';

echarts.use([TooltipComponent, GridComponent, LegendComponent, BarChart, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<
  TooltipComponentOption | GridComponentOption | LegendComponentOption | BarSeriesOption
>;

interface TotalRevenueChartProps {
  data: {
    'Online Sales': number[];
    'Offline Sales': number[];
  };
  style?: {
    height?: number;
    width?: number;
  };
}

const TotalRevenueChart = ({ data, style }: TotalRevenueChartProps) => {
  const theme = useTheme();
  const { up } = useBreakpoints();

  const isSm = up('sm');

  const totalRevenueChartOption: EChartsOption = useMemo(() => {
    return {
      color: [theme.palette.info.main, theme.palette.success.main],

      tooltip: {
        confine: true,
      },

      legend: {
        data: ['Online Sales', 'Offline Sales'],
        left: 'center',
        bottom: 0,
        icon: 'circle',
        textStyle: {
          fontFamily: theme.typography.body2.fontFamily,
        },
        itemGap: isSm ? 20 : 10,
        itemHeight: 11,
      },

      xAxis: {
        data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          fontSize: theme.typography.fontSize - 2,
          color: theme.palette.grey.A200,
          margin: 18,
        },
      },

      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: theme.typography.fontSize - 2,
          color: theme.palette.grey.A200,
          formatter: '{value}k',
          margin: 18,
        },

        splitLine: {
          lineStyle: {
            color: theme.palette.grey.A400,
          },
        },
      },

      grid: {
        top: '4%',
        left: 0,
        right: 6,
        bottom: 45,
        containLabel: true,
      },

      series: [
        {
          name: 'Online Sales',
          type: 'bar',
          data: data['Online Sales'],
          itemStyle: {
            borderRadius: 2,
          },
          barCategoryGap: '65%',
        },
        {
          name: 'Offline Sales',
          type: 'bar',
          data: data['Offline Sales'],
          itemStyle: {
            borderRadius: 2,
          },
          barCategoryGap: '65%',
        },
      ],
    };
  }, [theme, data, isSm]);

  return <ReactEchart echarts={echarts} option={totalRevenueChartOption} style={style} />;
};

export default TotalRevenueChart;
