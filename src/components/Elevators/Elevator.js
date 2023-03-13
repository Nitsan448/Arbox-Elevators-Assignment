import React, { useEffect, useState, useRef } from "react";
import classes from "./Elevator.module.css";
import elevatorImage from "../../images/icons8-elevator.svg";

function Elevator(props) {
	const { index, floor, destination, waiting } = props.elevatorState;
	const updateElevatorState = useRef(props.updateElevatorState);

	let newFloor = floor;
	if (destination > floor) {
		newFloor++;
	} else if (destination < floor && destination !== -1) {
		newFloor--;
	}

	const translationPercent = newFloor * -200;
	//To account for the grid border gap
	const translationPixels = newFloor * -2;

	const timeToSwitchFloorInSeconds = 1;
	const timeToReachDestinationFromOrigin = timeToSwitchFloorInSeconds * 1000;
	const waitingTime = 2000;

	useEffect(() => {
		const timer = setTimeout(() => {
			if (destination !== newFloor) {
				updateElevatorState.current({
					type: "update",
					payload: { index: index, floor: newFloor, destination, waiting: false },
				});
			} else {
				updateElevatorState.current({
					type: "update",
					payload: { index: index, floor: newFloor, destination, waiting: destination !== -1 },
				});
			}
		}, timeToReachDestinationFromOrigin);
		return () => {
			clearTimeout(timer);
		};
	}, [destination, timeToReachDestinationFromOrigin, updateElevatorState, index, newFloor]);

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
