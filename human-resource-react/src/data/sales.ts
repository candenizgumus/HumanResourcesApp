import { SvgIconProps } from '@mui/material';
import OrderIcon from '../components/icons/OrderIcon';
import SalesIcon from '../components/icons/SalesIcon';

export interface SaleItem {
  label: string;
  value: string;
  growth: string;
  bgColor: string;
  iconBackgroundColor: string;
  icon?: string;
  svgIcon?: (props: SvgIconProps) => JSX.Element;
}

export const sales: SaleItem[] = [
  {
    label: 'Total Sales',
    value: '$1k',
    growth: '+8%',
    bgColor: 'error.lighter',
    iconBackgroundColor: 'error.main',
    svgIcon: SalesIcon,
  },
  {
    label: 'Total Order',
    value: '300',
    growth: '+5%',
    bgColor: 'warning.lighter',
    iconBackgroundColor: 'error.dark',
    svgIcon: OrderIcon,
  },
  {
    label: 'Sold',
    value: '5',
    growth: '+1.2%',
    bgColor: 'success.lighter',
    iconBackgroundColor: 'success.darker',
    icon: 'ion:pricetag',
  },
  {
    label: 'Customers',
    value: '8',
    growth: '+0.5%',
    bgColor: 'secondary.lighter',
    iconBackgroundColor: 'secondary.main',
    icon: 'material-symbols:person-add',
  },
];
