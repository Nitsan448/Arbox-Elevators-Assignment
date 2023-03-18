import React from "react";
import classes from "./Settings.module.css";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setSettings } from "../store/settingsSlice";
import { useNavigate } from "react-router-dom";

function Settings(props) {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm({
		defaultValues: {
			floors: 10,
			elevators: 5,
			floorTransitionTime: 1,
		},
	});

	function saveSettingsAndGoToMainPage(data) {
		dispatch(
			setSettings({
				floors: data.floors,
				elevators: data.elevators,
				floorTransitionTime: data.floorTransitionTime,
			})
		);

		navigate("/Elevators");
	}

	return (
		<form className={classes.settingsForm} onSubmit={handleSubmit(saveSettingsAndGoToMainPage)}>
			<label htmlFor="floors">Number of floors:</label>
			<input
				type="number"
				{...register("floors", {
					required: "Please enter a valid number of floors",
					min: { value: 1, message: "There must be at least one floor in the building" },
				})}
			/>
			{errors.floors && <p className={"invalidParagraph"}>{errors.floors.message}</p>}
			<label htmlFor="elevators">Number of Elevators:</label>
			<input
				type="number"
				{...register("elevators", {
					required: "Please enter a valid number of elevators",
					min: { value: 1, message: "There must be at least one elevator in the building" },
				})}
			/>
			{errors.elevators && <p className={"invalidParagraph"}>{errors.elevators.message}</p>}
			<label htmlFor="floorTransitionTime">Floor transition time (in seconds):</label>
			<input
				type="number"
				step={0.1}
				{...register("floorTransitionTime", {
					required: "Please enter the floor transition time",
					min: { value: 0, message: "Elevators cannot have a negative speed" },
				})}
			/>
			{errors.floorTransitionTime && <p className={"invalidParagraph"}>{errors.floorTransitionTime.message}</p>}
			<button>Enter building</button>
		</form>
	);
}

export default Settings;
