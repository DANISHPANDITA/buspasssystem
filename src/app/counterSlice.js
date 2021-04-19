import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "busPassApp",
  initialState: {
    user: null,
    Sour_Des: "",
    fare: 0,
    passengers: 0,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    createRoute: (state, action) => {
      state.Sour_Des = action.payload;
    },
    removePrevRoute: (state) => {
      state.Sour_Des = "";
    },
    fareTaker: (state, action) => {
      state.fare = action.payload;
    },
    fareReset: (state) => {
      state.fare = 0;
    },
    countPeople: (state) => {
      state.passengers += 1;
    },
    SubPeople: (state) => {
      state.passengers -= 1;
    },
    resetCount: (state) => {
      state.passengers = 0;
    },
  },
});

export const {
  createRoute,
  removePrevRoute,
  login,
  logout,
  fareReset,
  fareTaker,
  countPeople,
  SubPeople,
  resetCount,
} = counterSlice.actions;

export const selectUser = (state) => state.busPassApp.user;
export const SelectRoute = (state) => state.busPassApp.Sour_Des;
export const SelectFare = (state) => state.busPassApp.fare;
export const SelectPassengers = (state) => state.busPassApp.passengers;

export default counterSlice.reducer;
