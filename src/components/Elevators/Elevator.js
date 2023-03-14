import React, { useEffect, useState, useRef } from "react";
import classes from "./Elevator.module.css";
import elevatorImage from "../../images/icons8-elevator.svg";

function Elevator(props) {
	const { index, floor, destination, isWaiting } = props.elevatorState;
	const updateElevatorState = useRef(props.updateElevatorState);
	const hasMoved = destination !== -1;

	let newFloor = floor;
	if (destination > floor) {
		newFloor++;
	} else if (destination < floor && hasMoved) {
		newFloor--;
	}

	const translationPercent = newFloor * -200;
	//To account for the grid border gap
	const translationPixels = newFloor * -2;

	const timeToSwitchFloor = 1000;
	const waitingTime = 2000;

	useEffect(() => {
		const timer = setTimeout(() => {
			const reachedDestination = destination === newFloor && hasMoved;
			updateElevatorState.current({
				payload: { index: index, floor: newFloor, destination, isWaiting: reachedDestination },
			});
		}, timeToSwitchFloor);
		return () => {
			clearTimeout(timer);
		};
	}, [destination, timeToSwitchFloor, updateElevatorState, index, newFloor, hasMoved]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (isWaiting) {
				updateElevatorState.current({
					payload: { index, floor, destination, isWaiting: false },
				});
			}
		}, waitingTime);
		return () => {
			clearTimeout(timer);
		};
	}, [waitingTime, updateElevatorState, index, floor, destination, isWaiting]);

	return (
		<img
			style={{
				transform: `translateY(calc(${translationPercent}% + ${translationPixels}px))`,
				transitionDuration: `${timeToSwitchFloor}ms`,
			}}
			className={classes.elevator}
			src={elevatorImage}
			alt="elevator"
		/>
	);
}

export default Elevator;
