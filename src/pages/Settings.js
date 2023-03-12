import React from "react";
import classes from "./Settings.module.css";
import { useForm } from "react-hook-form";

function Settings(props) {
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm({
		defaultValues: {
			floors: 10,
		},
	});
	return (
		<form>
			<div>
				<label htmlFor="floors">Number of floors:</label>
				<input
					type="text"
					{...register("floors", {
						required: "Please enter your Email or user name",
					})}
				/>
				{errors.floors && <p className={"invalidParagraph"}>{errors.floors.message}</p>}
			</div>
		</form>
	);
}

export default Settings;
