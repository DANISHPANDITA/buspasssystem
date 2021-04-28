import { createSlice } from "@reduxjs/toolkit";

export const driverSlice = createSlice({
  name: "DriverBookings",
  initialState: {
    BusSeatsBookedArray: [],
  },
  reducers: {
    addToBookArray: (state, action) => {
      state.BusSeatsBookedArray = [
        ...state.BusSeatsBookedArray,
        action.payload,
      ];
    },
    emptyBookedSeatsBusArray: (state) => {
      state.BusSeatsBookedArray = [];
    },
    removeBooking: (state, action) => {
      state.BusSeatsBookedArray = state.BusSeatsBookedArray.filter(
        (val) => val !== action.index
      );
    },
  },
});
export const {
  addToBookArray,
  emptyBookedSeatsBusArray,
  removeBooking,
} = driverSlice.actions;
export const SelectBookedSeatsArray = (state) =>
  state.DriverBookings.BusSeatsBookedArray;

export default driverSlice.reducer;
