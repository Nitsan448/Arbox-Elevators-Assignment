import { createSlice } from "@reduxjs/toolkit";

export const settingsSlice = createSlice({
	name: "settings",
	initialState: {
		elevators: 5,
		floors: 10,
		timeToSwitchFloor: 1,
		waitingTime: 2,
	},
	reducers: {
		setElevatorsAndFloors(state, action) {
			state.elevators = action.payload.elevators;
			state.floors = action.payload.floors;
		},
	},
});

export const { setElevatorsAndFloors } = settingsSlice.actions;

export default settingsSlice.reducer;
