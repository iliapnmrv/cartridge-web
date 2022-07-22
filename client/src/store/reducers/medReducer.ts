import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IHarm, IWorker } from "types/worker";

interface MedState {
  workers: IWorker[];
  harms: IHarm[];
  shifts: string[];
  shiftsAvailable: string[];
  search: string;
  dateFilter: Date | null;
  dateFilterCancel: Date | null;
}

const initialState: MedState = {
  workers: [],
  harms: [],
  shifts: [],
  shiftsAvailable: [],
  search: "",
  dateFilter: null,
  dateFilterCancel: new Date(),
};

export const medSlice = createSlice({
  name: "med",
  initialState,
  reducers: {
    setShifts: (state: MedState, action: PayloadAction<string[]>) => {
      state.shifts = action.payload;
    },
    setHarms: (state: MedState, action: PayloadAction<IHarm[]>) => {
      state.harms = action.payload;
    },
    setShiftsAvailable: (state: MedState, action: PayloadAction<string[]>) => {
      state.shiftsAvailable = action.payload;
    },
    setDateFilter: (state: MedState, action: PayloadAction<Date | null>) => {
      state.dateFilter = action.payload;
    },
    setDateFilterCancel: (
      state: MedState,
      action: PayloadAction<Date | null>
    ) => {
      state.dateFilterCancel = action.payload;
    },
  },
});

export const {
  setShifts,
  setShiftsAvailable,
  setDateFilter,
  setDateFilterCancel,
  setHarms,
} = medSlice.actions;

export default medSlice.reducer;
