import {
  Chip,
  LinearProgress,
  TableCell,
  TableRow,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { Product } from 'data/top-products';

const TopProduct = ({ product }: { product: Product }) => {
  const theme = useTheme();

  const { id, name, color, sales } = product;

  const [paletteOption, simplePaletteColorOption] = color.split('.') as [
    keyof typeof theme.palette,
    keyof (typeof theme.palette)[keyof typeof theme.palette],
  ];

  const productColor = theme.palette[paletteOption][simplePaletteColorOption];

  return (
    <TableRow>
      <TableCell>0{id}</TableCell>
      <TableCell size="small">
        <Typography variant="subtitle2" whiteSpace="nowrap">
          {name}
        </Typography>
      </TableCell>
      <TableCell>
        <LinearProgress
          variant="determinate"
          value={product.sales}
          sx={{
            bgcolor: alpha(productColor, 0.2),
            borderRadius: 2,
            width: 180,
            '& .MuiLinearProgress-bar': {
              bgcolor: color,
            },
          }}
        />
      </TableCell>
      <TableCell>
        <Chip label={`${sales}%`} variant="outlined" sx={{ color: color, borderColor: color }} />
      </TableCell>
    </TableRow>
  );
};

export default TopProduct;
