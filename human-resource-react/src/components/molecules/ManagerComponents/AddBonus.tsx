import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { IUser } from "../../../models/IUser";

interface AddBonusProps {
  open: boolean;
  onClose: () => void;
  selectedUser: IUser | null;
  description: string;
  setDescription: (value: string) => void;
  bonusAmount: number;
  setBonusAmount: (value: number) => void;
  bonusDate: Date | null;
  setBonusDate: (value: Date | null) => void;
  handleAddBonus: () => void;
  loading: boolean;
}

export default function AddBonus({
  open,
  onClose,
  selectedUser,
  description,
  setDescription,
  bonusAmount,
  setBonusAmount,
  bonusDate,
  setBonusDate,
  handleAddBonus,
  loading,
}: AddBonusProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Bonus to {selectedUser && selectedUser.name + " " + selectedUser.surname}</DialogTitle>
      <DialogContent>
        <Box component="form">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                variant="outlined"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Bonus Amount $"
                name="bonusAmount"
                variant="outlined"
                type="number"
                value={bonusAmount}
                onChange={(event) => setBonusAmount(parseInt(event.target.value))}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Bonus Date"
                  value={bonusDate ? dayjs(bonusDate) : null}
                  disablePast={true}
                  onChange={(newValue) => setBonusDate(newValue ? newValue.toDate() : null)}
                  sx={{ width: "100%" }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="contained" sx={{ marginRight: '17px', width: '100px' }}>
          Cancel
        </Button>
        <Button onClick={handleAddBonus} color="primary" disabled={loading} variant="contained" sx={{ marginRight: '17px', width: '100px' }}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
