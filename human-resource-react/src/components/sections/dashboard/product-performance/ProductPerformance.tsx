import { Box, Chip, Link, Paper, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import { rows } from '../../../../data/product-performance';
import { currencyFormat } from '../../../../helpers/utils';
import CustomPagination from '../../../../components/common/CustomPagination';
import SearchFilter from '../../../../components/common/SearchFilter';

const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'assigned',
    headerName: 'Assigned',
    flex: 1.5,
    minWidth: 200,
    valueGetter: ({ name }: { name: string }) => name,
    renderCell: (params) => {
      return (
        <Stack justifyContent="center" height={1}>
          <Typography
            variant="h6"
            component={Link}
            href="#!"
            color="text.primary"
            sx={{ width: 'max-content' }}
          >
            {params.row.assigned.name}
          </Typography>
          <Typography variant="subtitle2">{params.row.assigned.role}</Typography>
        </Stack>
      );
    },
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1.5,
    minWidth: 200,
  },
  {
    field: 'priority',
    headerName: 'Priority',
    flex: 1,
    minWidth: 150,
    renderCell: (params) => {
      let color: string = '';
      switch (params.value) {
        case 'Low':
          color = 'success.lighter';
          break;
        case 'Medium':
          color = 'info.lighter';
          break;
        case 'High':
          color = 'error.lighter';
          break;
        case 'Critical':
          color = 'warning.lighter';
          break;
      }
      return <Chip label={params.value} sx={{ bgcolor: color }} />;
    },
  },
  {
    field: 'budget',
    headerName: 'Budget',
    flex: 0.5,
    minWidth: 150,
    valueGetter: (value) => value,
    valueFormatter: (value: number) => `${currencyFormat(value / 1000)}k`,
  },
];

const ProductPerformance = () => {
  const apiRef = useGridApiRef();

  return (
    <Paper sx={{ p: 3 }}>
      <Stack
        direction={{ md: 'row' }}
        rowGap={2}
        justifyContent="space-between"
        alignItems={{ md: 'center' }}
      >
        <Typography variant="h4" color="primary.dark">
          Product Performance
        </Typography>

        <SearchFilter apiRef={apiRef} sx={{ maxWidth: 350 }} />
      </Stack>

      <Box
        sx={{
          height: 400,
          width: 1,
          mt: 3,
        }}
      >
        <DataGrid
          apiRef={apiRef}
          columns={columns}
          rows={rows}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
        />
      </Box>
      <CustomPagination apiRef={apiRef} />
    </Paper>
  );
};

export default ProductPerformance;
