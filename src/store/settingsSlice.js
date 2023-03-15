import { createSlice } from "@reduxjs/toolkit";

export const settingsSlice = createSlice({
	name: "settings",
	initialState: {
		elevators: 5,
		floors: 10,
		floorTransitionTime: 1,
		waitingTime: 2,
	},
	reducers: {
		setSettings(state, action) {
			state.elevators = action.payload.elevators;
			state.floors = action.payload.floors;
			state.floorTransitionTime = action.payload.floorTransitionTime;
		},
	},
});

export const { setSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
