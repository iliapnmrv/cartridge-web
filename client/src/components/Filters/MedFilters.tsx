import {
  Autocomplete,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import React, { useEffect } from "react";
import {
  setDateFilter,
  setDateFilterCancel,
  setShifts,
  setShiftsAvailable,
} from "store/reducers/medReducer";
import styles from "styles/Home.module.css";
import { IWorker } from "types/worker";
import CancelIcon from "@mui/icons-material/Cancel";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { checkboxLabel } from "constants/index";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

type Props = {
  workers: IWorker[] | undefined;
};

const MedFilters = ({ workers }: Props) => {
  const { shifts, dateFilter, dateFilterCancel, shiftsAvailable } =
    useAppSelector((state) => state.med);
  const dispatch = useAppDispatch();

  const handleShiftChange = (value: string[]) => {
    dispatch(setShifts(value));
  };

  console.log("shiftsAvailable", shiftsAvailable);
  console.log("shifts", shifts);

  const handleDateFilterChange = (newValue: Date | null) => {
    dispatch(setDateFilter(newValue));
  };

  useEffect(() => {
    dateFilter ? setDateFilterCancel(null) : null;
  }, [dateFilter]);

  return (
    <div className={styles.filters}>
      <FormControl sx={{ width: 300 }}>
        <Autocomplete
          multiple
          id="shifts"
          value={shifts}
          onChange={(_: any, newValue: string[]) => {
            handleShiftChange(newValue);
          }}
          options={shiftsAvailable ? shiftsAvailable : []}
          disableCloseOnSelect
          getOptionLabel={(option) => option}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option}
            </li>
          )}
          style={{ width: 500 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Смена сотрудников"
              placeholder="Смена сотрудников"
            />
          )}
        />
      </FormControl>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Checkbox
          onClick={() => {
            setDateFilterCancel(dateFilter ? dateFilter : null);
            setDateFilter(dateFilter ? null : dateFilterCancel);
          }}
          checked={!!dateFilterCancel}
          {...checkboxLabel}
          icon={<CancelOutlinedIcon />}
          checkedIcon={<CancelIcon />}
        />
        <DatePicker
          label="Предстоящая медкомиссия на"
          inputFormat="DD/MM/yyyy"
          value={dateFilter}
          onChange={handleDateFilterChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </div>
    </div>
  );
};

export default MedFilters;
