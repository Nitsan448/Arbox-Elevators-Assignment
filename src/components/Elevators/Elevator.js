import React, { useEffect, useState, useRef } from "react";
import classes from "./Elevator.module.css";
import elevatorImage from "../../images/icons8-elevator.svg";

function Elevator(props) {
	const { index, floor, destination, waiting } = props.elevatorState;
	const updateElevatorState = useRef(props.updateElevatorState);

	const translationPercent = destination * -200;
	//To account for the grid border gap
	const translationPixels = destination * -2;

	const timeToSwitchFloorInSeconds = 1;
	const timeToReachDestinationFromOrigin = Math.abs(destination - floor) * timeToSwitchFloorInSeconds * 1000;
	const waitingTime = 2000;

	useEffect(() => {
		const timer = setTimeout(() => {
			if (destination !== floor) {
				updateElevatorState.current({
					type: "update",
					payload: { index: index, floor: destination, destination, waiting: true },
				});
			}
		}, timeToReachDestinationFromOrigin);
		return () => {
			clearTimeout(timer);
		};
	}, [floor, destination, timeToReachDestinationFromOrigin, updateElevatorState, index]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (waiting) {
				updateElevatorState.current({
					type: "update",
					payload: { index, floor, destination, waiting: false },
				});
			}
		}, waitingTime);
		return () => {
			clearTimeout(timer);
		};
	}, [waitingTime, updateElevatorState, index, floor, destination, waiting]);

	return (
		<img
			style={{
				transform: `translateY(calc(${translationPercent}% + ${translationPixels}px))`,
				transitionDuration: `${timeToReachDestinationFromOrigin}ms`,
			}}
			className={classes.elevator}
			src={elevatorImage}
			alt="elevator"
		/>
	);
}

export default Elevator;
