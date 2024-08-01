import { useTheme } from '@mui/material';

export interface SalesMappingDataItem {
  name: string;
  value: number;
  itemStyle: {
    areaColor: string;
  };
}

export const getSalesMappingData = () => {
  const theme = useTheme();

  const salesMappingData: SalesMappingDataItem[] = [
    {
      name: 'Brazil',
      value: 19000,
      itemStyle: { areaColor: theme.palette.red.main },
    },
    {
      name: 'United States',
      value: 11000,
      itemStyle: { areaColor: theme.palette.orange.main },
    },
    {
      name: 'China',
      value: 41000,
      itemStyle: { areaColor: theme.palette.secondary.light },
    },
    { name: 'Saudi Arabia', value: 7000, itemStyle: { areaColor: theme.palette.green.dark } },
    {
      name: 'Dem. Rep. Congo',
      value: 27000,
      itemStyle: { areaColor: theme.palette.info.light },
    },
    {
      name: 'Indonesia',
      value: 27000,
      itemStyle: { areaColor: theme.palette.green.darker },
    },
  ];

  return salesMappingData;
};
