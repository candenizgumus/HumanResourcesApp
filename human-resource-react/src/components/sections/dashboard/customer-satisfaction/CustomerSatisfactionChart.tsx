import { alpha, useTheme } from '@mui/material';
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption,
} from 'echarts/components';
import { LineChart, LineSeriesOption } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { MutableRefObject, useMemo } from 'react';
import EChartsReactCore from 'echarts-for-react/lib/core';
import ReactEchart from 'components/base/ReactEhart';

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

type EChartsOption = echarts.ComposeOption<
  TooltipComponentOption | GridComponentOption | LegendComponentOption | LineSeriesOption
>;

interface CustomerSatisfactionChart {
  chartRef: MutableRefObject<EChartsReactCore | null>;
  data: {
    'last month': number[];
    'this month': number[];
  };
  style?: {
    height?: number;
    width?: number;
  };
}

const CustomerSatisfactionChart = ({ chartRef, data, style }: CustomerSatisfactionChart) => {
  const theme = useTheme();

  const customerSatisfactionChartOption = useMemo(() => {
    const option: EChartsOption = {
      color: [theme.palette.info.main, theme.palette.success.dark],
      tooltip: {
        trigger: 'item',
        show: true,
      },

      legend: {
        show: false,
      },

      grid: {
        top: 0,
        left: -26,
        right: 4,
        bottom: 0,
        containLabel: true,
      },

      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          show: false,
        },
      ],
      yAxis: [
        {
          type: 'value',
          show: false,
        },
      ],
      series: [
        {
          name: 'Last Month',
          type: 'line',
          stack: 'Customer Satisfaction',
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 1,
                color: alpha(theme.palette.info.main, 0),
              },
              {
                offset: 0,
                color: alpha(theme.palette.info.main, 0.31),
              },
            ]),
          },

          emphasis: {
            focus: 'series',
          },
          data: data['last month'],
          symbol: 'circle',
          symbolSize: 8,
        },
        {
          name: 'This Month',
          type: 'line',
          stack: 'Customer Satisfaction',
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 1,
                color: alpha(theme.palette.success.main, 0),
              },
              {
                offset: 0,
                color: alpha(theme.palette.success.main, 0.32),
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: data['this month'],
          symbol: 'circle',
          symbolSize: 8,
        },
      ],
    };
    return option;
  }, [theme, data]);

  return (
    <ReactEchart
      echarts={echarts}
      option={customerSatisfactionChartOption}
      ref={chartRef}
      style={style}
    />
  );
};

export default CustomerSatisfactionChart;
