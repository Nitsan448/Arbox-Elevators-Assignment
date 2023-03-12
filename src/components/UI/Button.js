import React from "react";
import classes from "./Button.module.css";

function Button(props) {
	let buttonClasses;

	switch (props.text) {
		case "waiting":
			buttonClasses = `${classes.button} ${classes.waiting}`;
			break;
		case "arrived":
			buttonClasses = `${classes.button} ${classes.arrived}`;
			break;
		default:
			buttonClasses = `${classes.button} ${classes.call}`;
			break;
	}
	return (
		<button disabled={props.disabled} className={buttonClasses} onClick={props.onClick}>
			{props.text}
		</button>
	);
}

export default Button;
