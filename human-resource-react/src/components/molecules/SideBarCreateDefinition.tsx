import React, { useState, ChangeEvent, useEffect } from 'react';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { fetchDeleteDefinition, fetchGetDefinitions, fetchSaveDefinition } from '../../store/feature/definitionSlice';
import { EDefinitionType } from '../../models/IDefinitionType';
import Swal from "sweetalert2";
import { HumanResources, useAppSelector } from '../../store';
import { DataGrid, GridColDef, GridRowSelectionModel, GridToolbar } from "@mui/x-data-grid";
import {AddIcon, DeleteIcon} from '../atoms/icons';


const UserForm: React.FC = () => {
  const dispatch = useDispatch<HumanResources>();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(true);
  const [definitionType, setDefinitionType] = useState<EDefinitionType>(EDefinitionType.EMPLOYEE_TYPE);
  const definitionList = useAppSelector((state) => state.definition.definitionList);
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);

  // Conditionally include the "Predefined" column
  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1, headerAlign: "center" },
    { field: "definitionType", headerName: "Type", flex: 1, headerAlign: "center" },
    ...(user?.userType === 'MANAGER' ? [
      {
        field: "companyId",
        headerName: "Predefined",
        flex: 1,
        headerAlign: "center" as const,
        valueGetter: (params: number) => (params === null ? "True" : "False")
      }
    ] : [])
  ];

  const handleCreateClick = async () => {
    setLoading(true);
    try {
      let result = await dispatch(fetchSaveDefinition({
        name: name.toUpperCase(),
        definitionType: definitionType as EDefinitionType,
        token: localStorage.getItem('token') ?? ''
      })).unwrap();

      if (result.code) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message,
          confirmButtonColor: '#1976D2',
        });
        setLoading(false);
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Definition Created.',
        confirmButtonColor: '#1976D2',
      });
      dispatch(fetchGetDefinitions({ token, definitionType }))
      setLoading(false);
    } catch (error) {
      console.error("Error creating definition:", error);
      Swal.fire("Error", "There was a problem creating the definition.", "error");
    }
  };

  useEffect(() => {
    if (name && definitionType) {
      setIsSelected(false);
    }

    dispatch(fetchGetDefinitions({ token, definitionType }))
  }, [name, definitionType]);

  const handleDefinitionTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedValue = e.target.value;
    setDefinitionType(selectedValue as unknown as EDefinitionType);
  };

  const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
    setSelectedRowIds(newSelectionModel as number[]);
  };

  const handleDeleteClick = async () => {
    if (selectedRowIds.length > 0) {
      try {
        for (const id of selectedRowIds) {
          const result = await dispatch(fetchDeleteDefinition({
            token: token,
            id: id,
          }));

          if (result.payload.message) {
            Swal.fire({
              icon: 'error',
              title: result.payload.message,
              timer: 1500
            })
          } else {
            dispatch(fetchGetDefinitions({ token, definitionType }))
            Swal.fire("Success", "Definition deleted successfully", "success");
          }
        }
      } catch (error) {
        console.error("Error deleting definitions:", error);
        Swal.fire("Error", "There was a problem deleting the definitions.", "error");
      }
    } else {
      Swal.fire("Please select at least one definition to delete.");
    }
  };

  return (
    <div style={{ height: 'auto', width: "inherit" }}>
      <DataGrid
        paginationMode="server"
        rows={definitionList}
        columns={columns}
        checkboxSelection
        onRowSelectionModelChange={handleRowSelection}
        slots={{
          toolbar: GridToolbar,
        }}
        getRowClassName={(params) =>
          params.row.isRead === false ? 'MuiDataGrid-row--highlighted' : ''
        }
        sx={{
          "& .MuiDataGrid-columnHeaderTitle": {
            textAlign: "center",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-cell": {
            textAlign: "center",
          },
          "& .MuiDataGrid-row--highlighted": {
            backgroundColor: "#C8E6C9",
          },
          "& .MuiDataGrid-footerContainer .MuiTablePagination-displayedRows": {
            display: "none",
          },
          "& .MuiTablePagination-input": {
            display: "none",
          },
          "& .MuiTablePagination-actions": {
            display: "none",
          },
          "& .MuiToolbar-regular": {
            display: "none",
          },
          marginTop: '2%',
          height: '407px'
        }}
      />
      <Grid sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '2%', marginBottom: '2%' }}>
        <Button
          onClick={handleDeleteClick}
          variant="contained"
          color="error"
          disabled={selectedRowIds.length === 0}
          startIcon={<DeleteIcon />}
          sx={{ marginRight: '1%', width: '200px' }}
        >
          Delete
        </Button>
        <Button
          onClick={handleCreateClick}
          variant="contained"
          color="primary"
          disabled={loading || name === ''}
          startIcon={<AddIcon />}
          sx={{ marginRight: '1%', width: '200px' }}
        >
          Create
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth required>
              <InputLabel>Definition Type</InputLabel>
              <Select
                value={definitionType}
                onChange={handleDefinitionTypeChange as any}
              >
                {Object.values(EDefinitionType).map(type => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Definition Name"
              name="name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              fullWidth
              inputProps={{ maxLength: 64 }}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserForm;
