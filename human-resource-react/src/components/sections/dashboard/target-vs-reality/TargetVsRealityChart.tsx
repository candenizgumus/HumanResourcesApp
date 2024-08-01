import { useTheme } from '@mui/material';
import { useMemo } from 'react';
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
} from 'echarts/components';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEchart from 'components/base/ReactEhart';

echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<
  TooltipComponentOption | GridComponentOption | BarSeriesOption
>;

interface TargetVsRealityChartProps {
  data: {
    reality: number[];
    target: number[];
  };
  style?: {
    height?: number;
    width?: number;
  };
}

const TargetVsRealityChart = ({ style, data }: TargetVsRealityChartProps) => {
  const theme = useTheme();

  const targetVsRealityChartOption = useMemo(() => {
    const option: EChartsOption = {
      color: [theme.palette.success.light, theme.palette.yellow.main],

      tooltip: {
        confine: true,
      },

      xAxis: {
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July'],
        boundaryGap: true,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          fontSize: theme.typography.fontSize - 4,
          color: theme.palette.grey.A200,
        },
      },

      yAxis: {
        show: false,
        type: 'value',
      },

      grid: {
        top: 0,
        bottom: 0,
        left: -30,
        right: 0,
        containLabel: true,
      },

      series: [
        {
          type: 'bar',
          data: data.reality,
          itemStyle: {
            borderRadius: 5,
          },
          barCategoryGap: '30%',
        },
        {
          type: 'bar',
          data: data.target,
          itemStyle: {
            borderRadius: 5,
          },
          barCategoryGap: '30%',
        },
      ],
    };
    return option;
  }, [theme, data]);

  return <ReactEchart echarts={echarts} option={targetVsRealityChartOption} style={style} />;
};

export default TargetVsRealityChart;
