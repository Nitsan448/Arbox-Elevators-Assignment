import React from "react";
import classes from "./Settings.module.css";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setElevatorsAndFloors } from "../store/settingsSlice";
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
		},
	});

	function saveSettingsAndGoToMainPage(data) {
		dispatch(
			setElevatorsAndFloors({
				floors: data.floors,
				elevators: data.elevators,
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
			<button>Enter building</button>
		</form>
	);
}

export default Settings;
