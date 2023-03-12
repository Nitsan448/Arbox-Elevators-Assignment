import React, { useEffect } from "react";
import classes from "./Elevator.module.css";
import elevatorImage from "../../images/icons8-elevator.svg";

function Elevator(props) {
	const translationPercent = props.elevatorState.floor * -200;

	//To account for the grid border gap
	const translationPixels = props.elevatorState.floor * -2;

	return (
		<img
			style={{ transform: `translateY(calc(${translationPercent}% + ${translationPixels}px))` }}
			className={classes.elevator}
			src={elevatorImage}
			alt="elevator"
		/>
	);
}

export default Elevator;
