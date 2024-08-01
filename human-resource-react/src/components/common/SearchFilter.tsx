import { SxProps, TextField } from '@mui/material';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { ChangeEvent, MutableRefObject } from 'react';
import IconifyIcon from 'components/base/IconifyIcon';

interface SearchFilterProps {
  apiRef: MutableRefObject<GridApiCommunity>;
  sx?: SxProps;
}

const SearchFilter = ({ apiRef, ...props }: SearchFilterProps) => {
  const handleFilter = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const searchText = value.toLowerCase();
    apiRef.current.setQuickFilterValues([searchText]);
  };

  return (
    <TextField
      InputProps={{
        startAdornment: (
          <IconifyIcon
            icon="gravity-ui:magnifier"
            sx={{ color: 'primary.main', fontSize: 32, mr: 1 }}
          />
        ),
      }}
      type="search"
      variant="filled"
      placeholder="Search..."
      onChange={handleFilter}
      {...props}
    />
  );
};

export default SearchFilter;
