import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { topProducts } from 'data/top-products';
import TopProduct from './TopProduct';

const TopProducts = () => {
  return (
    <Paper sx={{ pt: 3 }}>
      <Typography variant="h4" color="primary.dark" px={3} mb={1.25}>
        Top Products
      </Typography>

      <Box sx={{ overflow: 'auto' }}>
        <Table aria-label="top products table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Popularity</TableCell>
              <TableCell>Sales</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topProducts.map((product) => (
              <TopProduct key={product.id} product={product} />
            ))}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
};

export default TopProducts;
