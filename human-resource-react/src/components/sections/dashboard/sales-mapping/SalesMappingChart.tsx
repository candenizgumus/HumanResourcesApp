import { SxProps, useTheme } from '@mui/material';
import { MutableRefObject, useMemo } from 'react';
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  TooltipComponentOption,
  GeoComponent,
  GeoComponentOption,
} from 'echarts/components';
import { MapChart, MapSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { CallbackDataParams } from 'echarts/types/src/util/types.js';
import EChartsReactCore from 'echarts-for-react/lib/core';
import world from '../../../../assets/json/world.json';
import { SalesMappingDataItem } from '../../../../data/sales-mapping-data';
import ReactEchart from '../../../../components/base/ReactEhart';

echarts.use([TooltipComponent, GeoComponent, MapChart, CanvasRenderer]);
//@ts-ignore
echarts.registerMap('world', { geoJSON: world });

type EChartsOption = echarts.ComposeOption<
  TooltipComponentOption | GeoComponentOption | MapSeriesOption
>;

interface SalesMappingChartProps {
  salesMappingChartRef: MutableRefObject<EChartsReactCore | null>;
  data: SalesMappingDataItem[];
  style?: {
    height?: number;
    width?: number;
  };
  minZoomLevel: number;
  maxZoomLevel: number;
  sx?: SxProps;
}

const SalesMappingChart = ({
  salesMappingChartRef,
  data,
  style,
  minZoomLevel,
  maxZoomLevel,
  ...props
}: SalesMappingChartProps) => {
  const theme = useTheme();

  const salesMappingChartOption = useMemo(() => {
    const option: EChartsOption = {
      tooltip: {
        trigger: 'item',
        showDelay: 0,
        transitionDuration: 0.2,
        formatter: (params: CallbackDataParams) => {
          const { name, value } = params;
          if (value) return `${name} : ${value}`;
          else return `${name} : 0`;
        },
      },

      series: [
        {
          type: 'map',
          map: 'world',
          data,
          roam: true,
          scaleLimit: {
            min: minZoomLevel,
            max: maxZoomLevel,
          },
          left: 0,
          right: 0,
          label: {
            show: false,
          },
          selectedMode: false,
          itemStyle: {
            areaColor: theme.palette.grey.A700,
            borderColor: theme.palette.common.white,
            borderWidth: 0.2,
          },

          emphasis: {
            disabled: true,
          },
        },
      ],
    };
    return option;
  }, [theme, data]);

  return (
    <ReactEchart
      echarts={echarts}
      option={salesMappingChartOption}
      ref={salesMappingChartRef}
      style={style}
      {...props}
    />
  );
};

export default SalesMappingChart;
