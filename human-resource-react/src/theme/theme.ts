import { createTheme } from '@mui/material';
import palette from './palette';
import typography from './typography';
import CssBaseline from './components/CssBaseline';
import Link from './components/Link';
import Paper from './components/Paper';
import Stack from './components/Stack';
import AppBar from './components/AppBar';
import Button from './components/Button';
import ListItemButton from './components/ListItemButton';
import ListItemText from './components/ListItemText';
import ListItemIcon from './components/ListItemIcon';
import FilledInput from './components/FilledInput';
import InputAdornment from './components/InputAdornment';
import InputBase from './components/InputBase';
import Badge from './components/Badge';
import Drawer from './components/Drawer';
import Toolbar from './components/Toolbar';
import MenuItem from './components/MenuItem';
import shadows from './shadows';
import TableCell from './components/TableCell';
import Chip from './components/Chip';
import DataGrid from './components/Datagrid';
import PaginationItem from './components/PaginationItem';
import OutlinedInput from './components/OutlinedInput';
import TableBody from './components/TableBody';

export const theme = createTheme({
  palette,
  typography,
  mixins: {
    toolbar: {
      minHeight: 120,
    },
  },
  components: {
    MuiAppBar: AppBar,
    MuiToolbar: Toolbar,
    MuiPaper: Paper,
    MuiStack: Stack,
    MuiDrawer: Drawer,

    MuiButton: Button,
    MuiListItemButton: ListItemButton,
    MuiListItemText: ListItemText,
    MuiListItemIcon: ListItemIcon,
    MuiBadge: Badge,

    MuiInputBase: InputBase,
    MuiFilledInput: FilledInput,
    MuiInputAdornment: InputAdornment,
    MuiOutlinedInput: OutlinedInput,

    MuiMenuItem: MenuItem,

    MuiTableBody: TableBody,
    MuiTableCell: TableCell,
    MuiCssBaseline: CssBaseline,
    MuiLink: Link,
    MuiChip: Chip,
    MuiDataGrid: DataGrid,
    MuiPaginationItem: PaginationItem,
  },
});

// Add custom shadows to theme
shadows.forEach((shadow, index) => {
  theme.shadows[index + 1] = shadow;
});
