import { Typography, Stack, Pagination } from '@mui/material';
import {
  gridPageSelector,
  gridPageCountSelector,
  useGridSelector,
  gridPageSizeSelector,
  gridPaginationRowRangeSelector,
  gridExpandedRowCountSelector,
} from '@mui/x-data-grid';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { MutableRefObject } from 'react';

const CustomPagination = ({ apiRef }: { apiRef: MutableRefObject<GridApiCommunity> }) => {
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  const pageSize = useGridSelector(apiRef, gridPageSizeSelector);
  const filteredRows = useGridSelector(apiRef, gridExpandedRowCountSelector);
  const paginationRowRange = useGridSelector(apiRef, gridPaginationRowRangeSelector);

  const from = paginationRowRange ? page * pageSize + 1 : 0;
  const to = paginationRowRange
    ? page + 1 === pageCount
      ? paginationRowRange.lastRowIndex + 1
      : page * pageSize + pageSize
    : 0;

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems="center"
      justifyContent="flex-end"
      gap={{ xs: 1, sm: 3 }}
      sx={{ width: 1, overflow: 'auto' }}
    >
      <Typography variant="subtitle2" color="grey.600">
        {`Showing ${from}-${to} of ${filteredRows}`}
      </Typography>
      <Pagination
        color="primary"
        size="medium"
        count={pageCount}
        page={page + 1}
        onChange={(event, value) => {
          event.preventDefault();
          apiRef.current.setPage(value - 1);
        }}
      />
    </Stack>
  );
};

export default CustomPagination;
