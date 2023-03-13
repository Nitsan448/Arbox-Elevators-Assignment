import React, { useEffect, useRef } from "react";
import classes from "./Elevator.module.css";
import elevatorImage from "../../images/icons8-elevator.svg";

function Elevator(props) {
	const { floor, destination } = props.elevatorState;
	const updateElevatorFloor = useRef(props.updateElevatorFloor);

	const translationPercent = destination * -200;
	//To account for the grid border gap
	const translationPixels = destination * -2;

	const timeToSwitchFloorInSeconds = 1;
	const timeToReachDestinationFromOrigin = Math.abs(destination - floor) * timeToSwitchFloorInSeconds;

	useEffect(() => {
		const timer = setTimeout(() => {
			updateElevatorFloor.current(props.index, destination);
		}, timeToReachDestinationFromOrigin * 1000);
		return () => {
			clearTimeout(timer);
		};
	}, [destination, timeToReachDestinationFromOrigin, updateElevatorFloor]);

	return (
		<img
			style={{
				transform: `translateY(calc(${translationPercent}% + ${translationPixels}px))`,
				transitionDuration: `${timeToReachDestinationFromOrigin}s`,
			}}
			className={classes.elevator}
			src={elevatorImage}
			alt="elevator"
		/>
	);
}

export default Elevator;
